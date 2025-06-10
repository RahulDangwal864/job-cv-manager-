import { NextResponse, type NextRequest } from "next/server";
import { type Browser } from 'puppeteer';
import puppeteerCore, { type Browser as BrowserCore } from 'puppeteer-core';
// import puppeteer from 'puppeteer'; // 🔧 Commented: only used in local development
import chromium from '@sparticuz/chromium';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get('data');
  const template = searchParams.get('template');

  if (!data || !template) {
    return NextResponse.json({ message: 'Missing data or template' }, { status: 400 });
  }

  let browser: Browser | BrowserCore | null = null;

  try {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
      // ✅ Production: Use puppeteer-core + @sparticuz/chromium
      const executablePath = await chromium.executablePath();

      browser = await puppeteerCore.launch({
        executablePath,
        args: chromium.args,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport,
      });
    } else {
      // 🧪 Development: Use full puppeteer (uncomment if testing locally)
      /*
      console.log("Running in development mode, using full puppeteer.");
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      */
      console.error("Development mode Puppeteer is disabled. Uncomment the code to enable.");
    }

    if (!browser) throw new Error("Browser not initialized");

    const page = await browser.newPage();
    const url = `${process.env.BASE_URL}/resume/download?data=${encodeURIComponent(data)}&template=${template}`;
    console.log("Navigating to URL:", url);
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '10px',
        bottom: '20px',
        left: '10px'
      }
    });

    console.log("PDF generated. Buffer size:", pdfBuffer.length);
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
      },
    });

  } catch (err) {
    console.error('PDF generation error:', err);
    if (browser) await browser.close();
    return NextResponse.json(
      { message: 'Error generating PDF' },
      { status: 500 }
    );
  }
}
