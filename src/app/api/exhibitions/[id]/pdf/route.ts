import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { supabase } from '@/lib/supabaseClient';
import ArtworkLabel from '@/lib/ArtworkLabel';
import React from 'react';
import QRCode from 'qrcode'; // Using your existing install

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { renderToString } = await import('react-dom/server');
    const { id } = await params;
    
    const { data: exhibition, error } = await supabase
      .from('exhibitions')
      .select('*, artworks(*)')
      .eq('id', id)
      .single();

    if (error || !exhibition) return new Response("Not found", { status: 404 });

    // 1. Generate the QR codes as Base64 strings (Data URIs)
    const artworksWithQRs = await Promise.all(
      exhibition.artworks.map(async (art: any) => {
        const url = `${process.env.NEXT_PUBLIC_QRCODE_URL}/${exhibition.slug}/${art.slug}`;
        // Generate a high-quality 300dpi-ish QR code string
        const qrBase64 = await QRCode.toDataURL(url, { margin: 0, scale: 4 });
        return { ...art, qrCodeUrl: qrBase64 };
      })
    );

    // 2. Render the grid with the static image strings
    const labelsHtml = renderToString(
      React.createElement('div', {
        style: { 
          width: '8.5in', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 70mm)',
          placeContent: 'space-evenly',
          gap: '10mm',
          padding: '0.5in',
          backgroundColor: '#fff'
        }
      }, 
        artworksWithQRs.map((art: any) => 
          React.createElement(ArtworkLabel, {
            key: art.id,
            artwork: art,
            staticQr: art.qrCodeUrl // This is the magic key
          })
        )
      )
    );

    const browser = await (process.env.AWS_EXECUTION_ENV
      ? puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
        })
      : (await import('puppeteer')).launch()
    );
    const page = await browser.newPage();

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; font-family: sans-serif; }
            @page { size: letter; margin: 0; }
            img { display: block; }
          </style>
        </head>
        <body>${labelsHtml}</body>
      </html>
    `, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'letter', printBackground: true });
    await browser.close();

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(pdfBuffer);
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="labels-${exhibition.slug}.pdf"`,
      },
    });

  } catch (err) {
    console.error("PDF Generation Error:", err);
    return new Response(String(err), { status: 500 });
  }
}