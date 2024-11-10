// import OpenAI from 'openai';
// import { NextRequest, NextResponse } from 'next/server';

// const VALID_SECTORS = [
//   'SP500',
//   'Healthcare',
//   'Utilities',
//   'Real Estate',
//   'Industrials',
//   'Energy',
//   'Consumer Discretionary',
//   'Materials',
//   'Financials',
//   'Consumer Staples',
//   'Information Technology',
//   'Telecom Services',
//   'Bonds'
// ];

// interface Sector {
//   name: string;
//   percentage: number;
// }

// interface Stock {
//   symbol: string;
//   allocation: number;
// }

// interface PortfolioResponse {
//   sectors: Sector[];
//   stocks: Stock[];
//   annualContribution: number;
// }

// export async function POST(req: NextRequest) {
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

//   try {
//     const body = await req.json();
//     const { prompt } = body;

//     if (!prompt || typeof prompt !== 'string') {
//       return NextResponse.json(
//         { error: 'Invalid or missing prompt' },
//         { status: 400 }
//       );
//     }

//     const systemPrompt = `You are an investment advisor. Given an investment preference, you will return a portfolio allocation.
//     Your response MUST be valid JSON in the following format:
//     {
//       "sectors": [{ "name": string, "percentage": number }],
//       "stocks": [{ "symbol": string, "allocation": number }],
//       "annualContribution": number
//     }
    
//     Rules:
//     1. Sector names MUST ONLY be from this list: ${VALID_SECTORS.join(', ')}
//     2. All percentage/allocation values must be numbers between 0 and 100
//     3. Sector percentages must sum to 100
//     4. Stock allocations must sum to 100
//     5. Include 4-8 sectors and 12 stocks
//     6. Stock symbols must be valid NYSE/NASDAQ symbols
//     7. Annual contribution should be the amount specified in the prompt, or 10000 if not specified`;

//     // Send the correct structured request to OpenAI API
//     const gptResponse = await openai.chat.completions.create({
//       model: 'gpt-4o-2024-08-06',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: prompt }
//       ],
//       temperature: 0.5,
//     });

//     const content = gptResponse.choices[0].message.content;
//     if (!content) {
//       throw new Error('Empty response from GPT');
//     }

//     // Parse and validate the response
//     const portfolio: PortfolioResponse = JSON.parse(content);

//     console.log(portfolio)
    
//     // Validation
//     if (!validatePortfolio(portfolio)) {
//       throw new Error('Invalid portfolio structure received from GPT');
//     }

//     return NextResponse.json(portfolio);
//   } catch (error) {
//     console.error("Error: ", error);
//     return NextResponse.json(
//       { error: 'Failed to generate portfolio recommendation' },
//       { status: 500 }
//     );
//   }
// }

// function validatePortfolio(portfolio: any): portfolio is PortfolioResponse {
//   // Check basic structure
//   if (!portfolio.sectors || !portfolio.stocks || !portfolio.annualContribution) {
//     return false;
//   }

//   // Validate sectors
//   if (!Array.isArray(portfolio.sectors) || 
//       portfolio.sectors.length < 4 || 
//       portfolio.sectors.length > 8) {
//     return false;
//   }

//   // Validate stocks
//   if (!Array.isArray(portfolio.stocks) || 
//       portfolio.stocks.length < 8) {
//     return false;
//   }

//   // Validate sector names and percentages
//   const sectorTotal = portfolio.sectors.reduce((sum: number, sector: Sector) => {
//     if (!VALID_SECTORS.includes(sector.name) || 
//         typeof sector.percentage !== 'number' || 
//         sector.percentage < 0 || 
//         sector.percentage > 100) {
//       return -1;
//     }
//     return sum + sector.percentage;
//   }, 0);

//   if (Math.abs(sectorTotal - 100) > 0.01) {
//     return false;
//   }

//   // Validate stock allocations
//   const stockTotal = portfolio.stocks.reduce((sum: number, stock: Stock) => {
//     if (typeof stock.allocation !== 'number' || 
//         stock.allocation < 0 || 
//         stock.allocation > 100) {
//       return -1;
//     }
//     return sum + stock.allocation;
//   }, 0);

//   if (Math.abs(stockTotal - 100) > 0.01) {
//     return false;
//   }

//   // Validate annual contribution
//   if (typeof portfolio.annualContribution !== 'number' || 
//       portfolio.annualContribution < 0) {
//     return false;
//   }

//   return true;
// }

import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const VALID_SECTORS = [
  'S&P 500',
  'Healthcare',
  'Utilities',
  'Real Estate',
  'Manufacturing',
  'Energy',
  'Consumer Discretionary',
  'Raw Materials',
  'Finance',
  'Consumer Staples',
  'Technology',
  'Telecommunications',
  'Bonds'
] as const;

// Define Zod schemas
const SectorSchema = z.object({
  name: z.enum(VALID_SECTORS),
  percentage: z.number()
});

const StockSchema = z.object({
  symbol: z.string(),
  allocation: z.number()
});

const PortfolioSchema = z.object({
  sectors: z.array(SectorSchema)
    // .min(4)
    // .max(8)
    .refine((sectors) => {
      const total = sectors.reduce((sum, sector) => sum + sector.percentage, 0);
      return Math.abs(total - 100) <= 0.01;
    }, { message: "Sector percentages must sum to 100" }),
  stocks: z.array(StockSchema)
    // .min(12)
    .refine((stocks) => {
      const total = stocks.reduce((sum, stock) => sum + stock.allocation, 0);
      return Math.abs(total - 100) <= 0.01;
    }, { message: "Stock allocations must sum to 100" }),
  annualContribution: z.number(),
  startYear: z.number()
});

// Infer TypeScript types from Zod schema
type Portfolio = z.infer<typeof PortfolioSchema>;

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing prompt' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an investment advisor. Given an investment preference, you will return a portfolio allocation.
    Your response MUST follow these rules:
    1. Sector names MUST ONLY be from this list: ${VALID_SECTORS.join(', ')}
    2. All percentage/allocation values must be numbers between 0 and 100
    3. Sector percentages must sum to 100
    4. Stock allocations must sum to 100
    5. Include 4-8 sectors and exactly 12 stocks
    6. Stock symbols must be valid NYSE/NASDAQ symbols (1-5 capital letters)
    7. Annual contribution should be the amount specified in the prompt, or 10000 if not specified
    8. Must return a START YEAR date that is the number of user inputted years before 2023
    `;

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      response_format: zodResponseFormat(PortfolioSchema, "portfolio"),
      temperature: 0.2,
    });

    const portfolio = completion.choices[0].message.parsed;

    // Log the validated portfolio
    console.log('Validated portfolio:', portfolio);

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error: ", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid portfolio structure', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to generate portfolio recommendation' },
      { status: 500 }
    );
  }
}
