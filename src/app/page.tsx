"use client"
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PortfolioDashboard = () => {
  const portfolioData = {
    sectors: [
      { name: 'Healthcare', percentage: 20 },
      { name: 'Finance', percentage: 30 },
      { name: 'Energy', percentage: 10 },
      { name: 'S&P 500', percentage: 40 }
    ],
    stocks: [
      { symbol: 'AAPL', allocation: 20 },
      { symbol: 'GOOG', allocation: 30 },
      { symbol: 'AMZN', allocation: 10 },
      { symbol: 'NVDA', allocation: 40 }
    ]
  };

  const [question, setQuestion] = useState("");

  interface CardItem {
    period: string;
    percentage: string;
    description: string;
  }
  
  interface SectorData {
    sector: string;
    data: CardItem[];
  }

  const CardData: SectorData[] = [
    {
      sector: 'Healthcare',
      data: [
        { period: '2019-20', percentage: '24%', description: 'This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020.' },
        { period: '2020-21', percentage: '28%', description: 'This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020.' },
        { period: '2021-22', percentage: '32%', description: 'This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020.' },
      ]
    },
    {
      sector: 'Finance',
      data: [
        { period: '2019-20', percentage: '15%', description: 'This is the first finance explanation. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020.' },
        { period: '2020-21', percentage: '18%', description: 'This is the second finance explanation. This explains the trends in 2020-21...' },
        { period: '2021-22', percentage: '21%', description: 'This is the third finance explanation. This explains the trends in 2021-22...' },
      ]
    },
    {
      sector: 'Energy',
      data: [
        { period: '2019-20', percentage: '12%', description: 'This is the first energy explanation. This explains the trends in 2019-20...' },
        { period: '2020-21', percentage: '14%', description: 'This is the second energy explanation. This explains the trends in 2020-21...' },
        { period: '2021-22', percentage: '16%', description: 'This is the third energy explanation. This explains the trends in 2021-22...' },
      ]
    },
    {
      sector: 'Healthcare',
      data: [
        { period: '2019-20', percentage: '24%', description: 'This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020.' },
        { period: '2020-21', percentage: '28%', description: 'This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020.' },
        { period: '2021-22', percentage: '32%', description: 'This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020.' },
      ]
    },
    {
      sector: 'Finance',
      data: [
        { period: '2019-20', percentage: '15%', description: 'This is the first finance explanation. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020. This is the first healthcare explanation. This explains the trends in 2019-2020.' },
        { period: '2020-21', percentage: '18%', description: 'This is the second finance explanation. This explains the trends in 2020-21...' },
        { period: '2021-22', percentage: '21%', description: 'This is the third finance explanation. This explains the trends in 2021-22...' },
      ]
    },
    {
      sector: 'Energy',
      data: [
        { period: '2019-20', percentage: '12%', description: 'This is the first energy explanation. This explains the trends in 2019-20...' },
        { period: '2020-21', percentage: '14%', description: 'This is the second energy explanation. This explains the trends in 2020-21...' },
        { period: '2021-22', percentage: '16%', description: 'This is the third energy explanation. This explains the trends in 2021-22...' },
      ]
    },
  ];

  
  interface PaginatedCardProps {
    sectorData: SectorData;
  }
  
  const PaginatedCard: React.FC<PaginatedCardProps> = ({ sectorData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = sectorData.data.length;
  
    const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };
  
    const prevSlide = () => {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };
  
    const currentData = sectorData.data[currentIndex];
  
    return (
      <div className="flex-shrink-0 w-80 p-4 bg-purple-bg border border-text rounded-lg relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-MonoReg">{sectorData.sector}</h4>
            <p className="text-sm text-gray-600 font-MonoReg">{currentData.period}</p>
          </div>
          <span className="bg-green-100 px-2 py-1 rounded-xl text-sm text-text-green font-MonoReg">
            {currentData.percentage}
          </span>
        </div>
        <div className="h-32 overflow-y-auto text-sm font-MonoReg mb-6">
          {currentData.description}
        </div>
        
        {/* Pagination Controls */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-4">
          <button 
            onClick={prevSlide}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-MonoReg">
            {currentIndex + 1} / {totalSlides}
          </span>
          <button 
            onClick={nextSlide}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/getStructuredPort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to fetch GPT response');
      }
    } catch (error) {
      console.error("Error getting GPT response", error);
    }
  }
  

  return (
    <>
    <header className="flex justify-between items-center mb-4 p-4 pr-8 pl-8">
    <div className="flex items-center">
    <h1 className="text-text text-xl font-RalewayMed">Stratify</h1>
    </div>
    
    <div className="flex items-center text-text font-MonoReg text-xs">
    Made with 
    <span className="mx-1"></span> 
    <div className="text-icon-color mx-1">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#FF751F"
    className="w-4 h-4"
    >
    <path
      fillRule="evenodd"
      d="M12 4.318C9.403-1.715 1.278 1.32 1.278 6.737c0 2.462 1.23 4.731 3.133 6.666C6.764 15.916 9.03 18.36 12 21c2.97-2.64 5.236-5.084 7.589-7.597 1.903-1.935 3.133-4.204 3.133-6.666 0-5.418-8.125-8.452-10.722-2.419z"
      clipRule="evenodd"
    />
    </svg>
    </div>
    <span className="mx-1"></span>
    at Princeton
    </div>

    </header>

    <div className="p-6 max-w-6xl mx-auto font-RalewayReg text-text">
      <h1 className="text-4xl mb-8 font-RalewayMed">Good Morning, Shrenik</h1>
      
      {/* Search Bar */}
      <div className="relative mb-20">
  <input
    type="text"
    placeholder="Describe a portfolio..."
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    className="w-full p-4 pt-3 pb-3 border border-text rounded-3xl bg-purple-bg focus:outline-none"
  />
  <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-bg p-2 rounded-full" onClick={handleSubmit}>
    <Search className="w-6 h-6 text-text" />
  </button>
</div>


      {/* Portfolio Summary */}
      <h3 className="font-RalewayMed mb-2 text-lg">Customized Portfolio</h3>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-6 gap-3">
  {/* Left Panel (1/3 width) */}
  <div className="p-4 bg-purple-bg border border-text rounded-lg col-span-2">
  {/* <p className="text-sm font-MonoReg font-bold mb-4 flex items-center justify-center">
    Total Value: ${portfolioData.totalValue}
  </p> */}
  <div className="space-y-2 font-MonoReg">
    {portfolioData.sectors.map((sector) => (
      <div key={sector.name} className="grid grid-cols-3 gap-4">
        {/* Sector Name */}
        <span className="text-sm">{sector.name}</span>
        {/* Percentage Column */}
        <span className="text-sm text-center">{sector.percentage}%</span>
      </div>
    ))}
  </div>
</div>

  {/* Middle Panel (1/2 width) */}
  <div className="p-4 bg-purple-bg border border-text rounded-lg col-span-3">
  <div className='mt-6 ml-6'> 
    <div className="grid grid-cols-3 gap-4">
      {Array(3).fill(null).map((_, i) => (
        <div key={i} className={`space-y-2 ${i !== 2 ? 'border-r border-text' : ''}`}>
          {portfolioData.stocks.map((stock) => (
            <div key={stock.symbol} className="text-sm font-MonoReg">
              <div>{stock.symbol} {stock.allocation}%</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
</div>


  {/* Right Panel (1/6 width) */}
  <div className="p-4 bg-purple-bg border border-text rounded-lg col-span-1">
    {/* Add content for the right panel here */}
  </div>
</div>

      {/* Historical Analysis Section */}
      <div className="mb-8">
        <h3 className="font-['RalewayMed'] mb-4 text-lg">Historical Analysis</h3>
        <div className="h-64 bg-purple-bg border border-text rounded-lg">
          {/* Placeholder for future visualization */}
        </div>
      </div>

      <div className="mb-8">
      <h3 className="font-['RalewayMed'] mb-4 text-lg">Significant Deltas</h3>
      <div className="relative overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {CardData.map((sectorData, index) => (
            <PaginatedCard key={index} sectorData={sectorData} />
          ))}
        </div>
      </div>
    </div>

      {/* Generalized Analysis Section */}
      <div>
        <h3 className="font-['RalewayMed'] mb-4 text-lg">Generalized Analysis</h3>
        <div className="p-4 bg-purple-bg border border-text rounded-lg min-h-[200px]">
          {/* Placeholder for future content */}
        </div>
      </div>
    </div>
    </>
  );
};

export default PortfolioDashboard;
