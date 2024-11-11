"use client"
import { Search } from 'lucide-react';
import React, { useState, PureComponent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';
import * as rawdata from './data.json';
import ReactMarkdown from 'react-markdown';
import Image from "next/image"
import logo from "./images/startlogo.png"
import { marked } from 'marked';


interface Data {
  [key: string]: {
    [year: number]: number;
  };
}

const data: Data = rawdata
const PortfolioDashboard = () => {

  //this function will return the array to feed into the graph.
  //make sure to get the parameters right. startYear >= 1976.
  const getLines = (annualContribution: number, startYear: number, allocation: any) => {
    let lines: any = []

    let prevXvalue: any = null

    let delta = 1;

    for(let i = startYear; i <= 2023; i++){

      let xValue: any = {}

      xValue.name = i.toString()

      let total = 0;
      
      delta *= (100 - data['Inflation'][xValue.name])/100.0

      allocation.forEach((sector:any) => {
        if(!prevXvalue){
          xValue[sector.name] =  parseFloat((annualContribution * (sector.percentage / 100.0) * ((100 + data[sector.name][xValue.name])/100.0)).toFixed(2))
        }
        else {
          xValue[sector.name] = parseFloat(((prevXvalue[sector.name] + (annualContribution * (sector.percentage / 100.0)))  * ((100 + data[sector.name][xValue.name])/100.0)).toFixed(2))
        }
        total += xValue[sector.name]
      })
      xValue['Portfolio'] = parseFloat((total).toFixed(2))
      xValue['Portfolio - Inflation Adjusted'] = parseFloat((total * delta).toFixed(2))

      if(!prevXvalue){
        xValue['Savings Account - Inflation Adjusted'] = parseFloat((annualContribution * ((100 + 0.45 - data["Inflation"][xValue.name]) / 100.0)).toFixed(2))
      }
      else {
        xValue['Savings Account - Inflation Adjusted'] = parseFloat(((prevXvalue['Savings Account - Inflation Adjusted'] + annualContribution) * ((100 + 0.45 - data["Inflation"][xValue.name]) / 100.0)).toFixed(2))
      }

      lines.push(xValue)
      prevXvalue = xValue
    }

    return lines;
  }

  

  const [question, setQuestion] = useState("");
  const [isPortfolioGenerated, setIsPortfolioGenerated] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>();
  const [lineGraphData, setLineGraphData] = useState<any>(null);
  const [cardData, setCardData] = useState<any>(null);
  const [resArr, setResArr] = useState<any>([])
  const [analysis, setAnalysis] = useState("")

  
  const getDeltasExplanation = (startYear: number, allocation: any) => {
    let cardData: any = []

    allocation.forEach((sector: any) => {
      let card: any = { sector: sector.name }

      let topGains = [{period: startYear, percentage: data[sector.name][startYear]}, {period: startYear, percentage: data[sector.name][startYear+1]}, {period: startYear, percentage: data[sector.name][startYear+2]}].sort((a, b) => b.percentage - a.percentage)
      let topLoss = [{period: startYear, percentage: data[sector.name][startYear]}, {period: startYear, percentage: data[sector.name][startYear+1]}, {period: startYear, percentage: data[sector.name][startYear+2]}].sort((a, b) => a.percentage - b.percentage)

      for(let i = startYear + 3; i <= 2023; i++){
        let delta = data[sector.name][i]
        if(delta >= topGains[0].percentage){
          topGains[2] = topGains[1]
          topGains[1] = topGains[0]
          topGains[0] = {period: i, percentage: delta}
        }
        else if(delta >= topGains[1].percentage){
          topGains[2] = topGains[1]
          topGains[1] = {period: i, percentage: delta}
        }
        else if(delta >= topGains[2].percentage){
          topGains[2] = {period: i, percentage: delta}
        }
        if(delta <= topLoss[0].percentage){
          topLoss[2] = topLoss[1]
          topLoss[1] = topLoss[0]
          topLoss[0] = {period: i, percentage: delta}
        }
        else if(delta <= topLoss[1].percentage){
          topLoss[2] = topLoss[1]
          topLoss[1] = {period: i, percentage: delta}
        }
        else if(delta <= topLoss[2].percentage){
          topLoss[2] = {period: i, percentage: delta}
        }
      }

      topLoss = topLoss.filter((event) => event.percentage < 0)

      topGains.forEach( async (event: any, index) => {

        const response = await fetch('/api/getDeltaInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({sector: sector.name, ...event}), // Changed from { question } to { prompt: question }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch GPT response');
        }

        const res = await response.json(); // Add this to handle the response
        console.log(res)
        setResArr([res].concat(resArr))

        event.description = res

        
      })

      topLoss.forEach( async (event: any, index) => {

        const response = await fetch('/api/getDeltaInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({sector: sector.name, ...event}), // Changed from { question } to { prompt: question }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch GPT response');
        }
    
        const res = await response.json(); // Add this to handle the response
        console.log(res)
        setResArr([res].concat(resArr))

        event.description = res
      })

      card.data = topGains.concat(topLoss)

      cardData.push(card)
    });

    setCardData(cardData);
    return cardData;
  }

  const getAnalysis = async() => {
    const response = await fetch('/api/getAnalysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({portfolioData}), 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GPT response');
    }

    const res = await response.json(); 
    console.log(res)

    setAnalysis(res)
  }


  interface PaginatedCardProps {
    index: number;
  }
  
  const PaginatedCard: React.FC<PaginatedCardProps> = ({ index }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sectorData = cardData[index]
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
          {currentData.percentage > 0 ? (
            <span className="bg-green-100 px-2 py-1 rounded-xl text-sm text-text-green font-MonoReg">
              {currentData.percentage}
            </span>
          ) : (
            <span className="bg-red-100 px-2 py-1 rounded-xl text-sm text-red-700 font-MonoReg">
              {currentData.percentage}
            </span>
          )}
          
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
    // try {
      setIsPortfolioGenerated(false)

      const response = await fetch('/api/getStructuredPort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: question }), // Changed from { question } to { prompt: question }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch GPT response');
      }
  
      const res = await response.json(); // Add this to handle the response
      setPortfolioData(res);
      console.log(res); // Log the parsed response
      setIsPortfolioGenerated(true) 
      setLineGraphData(getLines(res.annualContribution, res.startYear, res.sectors))  
      getDeltasExplanation(res.startYear, res.sectors) 
      getAnalysis()
    // } catch (error) {
    //   console.error("Error getting GPT response", error);
    // }

  }

  console.log(cardData)
  

  return (
    <>
    <header className="flex justify-between items-center mb-4 p-4 pr-8 pl-8">
    <div className="flex items-center">
    <Image src={logo} alt="SustainLLM Icon" width={32} height={32} className="mr-2" />
    <h1 className="text-text text-xl font-RalewayMed">Stratify</h1>
    </div>
    
    <div className="flex items-center text-text font-MonoReg text-xs overflow-y-hidden">
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
  <div className="relative mb-16">
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

  {isPortfolioGenerated && 
  
  <div className='overflow-y-auto max-h-[59vh]'>
  <h3 className="font-RalewayMed mb-2 text-lg">Customized Portfolio</h3>
    <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-3">
  <div className="p-4 bg-purple-bg border border-text rounded-lg col-span-4">

  <p className="text-sm font-MonoSemiBold font-bold mb-4 flex items-center justify-center">
    Annual Contribution: ${portfolioData.annualContribution}
  </p>

  <div className="space-y-2 font-MonoReg ml-8">
    {portfolioData.sectors.map((sector:any) => (
      <div key={sector.name} className="grid grid-cols-2 gap-16">
        <span className="text-sm">{sector.name}</span>
        <span className="text-sm text-center">{sector.percentage}%</span>
      </div>
    ))}
  </div>
</div>

  {/* Middle Panel (1/2 width) */}
  <div className="p-4 bg-purple-bg border border-text rounded-lg col-span-5">
  <div className=''> 
  <p className="text-sm font-MonoSemiBold font-bold mb-4 flex items-center justify-center">
   Example Portfolio
  </p>
    <div className="ml-10 grid grid-cols-3 gap-8">
      {Array(3).fill(null).map((_, i) => (
        <div key={i} className={`space-y-2 ${i !== 2 ? 'border-r border-text' : ''}`}>
          {portfolioData.stocks.slice(4 * i, 4 * i + 4).map((stock:any) => (
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
  <div className="p-2 text-xs font-MonoReg bg-purple-bg border border-text rounded-lg col-span-3">
  {/* <p className="text-sm font-MonoReg font-bold">
   Investment Distribution
  </p> */}
  
  <ResponsiveContainer width="100%" height="100%">
        <PieChart width={50} height={50}>
          <Pie
            dataKey="percentage"
            startAngle={180}
            endAngle={0}
            data={portfolioData.sectors}
            cx="50%"
            cy="88%"
            outerRadius={90}
            fill="#8884d8"
            label
          />
        </PieChart>
      </ResponsiveContainer>
  </div>
</div>

      {/* Historical Analysis Section */}
      <div className="mb-8">
        <h3 className="font-['RalewayMed'] mb-4 text-lg">Historical Analysis</h3>
        <div className="h-96 bg-purple-bg border border-text rounded-lg font-MonoReg text-sm py-4">
          
          <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={800}
            height={700}
            data={lineGraphData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineGraphData && Object.keys(lineGraphData[0]).slice(1).map((line: any, index: any) => {
              
              const colorPalette = ["#D73838", "#EF933C", "#E5BF00", "#37B34C", "#3773B3", "#6737B3", "#AC37B3", "#379EB3"];
              const color = colorPalette[index % colorPalette.length];

              return(
              <Line type="monotone" key={line} dataKey={line} stroke={color} activeDot={{ r: 4 }} />
              );
            })}
            
          </LineChart>
          </ResponsiveContainer>

        </div>
      </div>

      <div className="mb-8">
      <h3 className="font-['RalewayMed'] mb-4 text-lg">Significant Deltas</h3>
      <div className="relative overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {console.log(resArr)}
          {resArr.length >= 1 && cardData && cardData.map((sectorData:any, index:any) => (
            <PaginatedCard key={index} index={index} />
          ))}
        </div>
      </div>
    </div>

      {/* Generalized Analysis Section */}
      <div>
        <h3 className="font-['RalewayMed'] text-lg">Generalized Analysis</h3>
        <div className="p-4 bg-purple-bg border border-text rounded-lg min-h-[200px]">
              {/* <ReactMarkdown>{analysis}</ReactMarkdown> */}
          <div dangerouslySetInnerHTML={{ __html: marked(analysis) }} className='font-MonoReg text-sm' />
       </div>
      </div>
  
  </div>}
    </div>
    </>
  );
};

export default PortfolioDashboard;
