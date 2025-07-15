import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

document.title = "📝 Clarity | A To-Do List to help Organize your life";

export default function Home() {

  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    {
      title: "Clear your mind",
      subtitle: "Capture tasks at the speed of thought",
      description: "We’ve spent over a decade refining Todoist to be an extension of your mind. Capture and organize tasks instantly using easy-flowing, natural language.",
      colorClass: "text-orange-600"
    },
    {
      title: "Focus on what matters",
      subtitle: "Smart task prioritization",
      description: "Todoist learns from your behavior and highlights what's important now. Prioritize your work and life effortlessly.", 
      colorClass: "text-blue-600"
    },
    {
      title: "Stay on track",
      subtitle: "Visual progress tracking",
      description: "See your progress in real time with project timelines, task dependencies, and interactive charts that keep you motivated.",
      colorClass: "text-red-600"
    },
    {
      title: "Work together, stay aligned",
      subtitle: "Team task management",
      description: "Assign tasks, add comments, and collaborate seamlessly across teams — all within one intuitive platform.",
      colorClass: "text-green-600"
    }
  ];

  const filters = ['Work', 'Personal', 'Education', 'Management', 'Marketing & Sales', 'Customer Support'];

  const cards = [
    {
      title: "Accounting Tasks",
      description: "Create a system to keep your books, receipts, and invoices organized.",
      bgColor: "bg-blue-50",
      icon: "🧮", // Replace with SVG or Font Awesome if needed
    },
    {
      title: "Business Travel Packing",
      description: "Never forget your laptop charger, lucky shoes, or passport again.",
      bgColor: "bg-sky-50",
      icon: "🧳",
    },
    {
      title: "Client Management",
      description: "Organize your work with clients from the smallest to largest details.",
      bgColor: "bg-yellow-50",
      icon: "🤝",
    },
    {
      title: "Deep Work",
      description: "Practice prioritizing focus, and making use with this template.",
      bgColor: "bg-gray-50",
      icon: "🧠",
    },
    {
      title: "Meeting Agenda",
      description: "Waste less time in meetings, ensuring they're action-oriented.",
      bgColor: "bg-pink-50",
      icon: "📖",
    }
  ];

  function BoldFirstPart({ text }) {
    const [first, second, ...rest] = text.split(' ');
    return (
      <>
        <span className="font-bold">{first}</span>
        <span className="font-bold">{second}</span><br></br>
        <span>{' ' + rest.join(' ')}</span>
      </>
    );
  }

  const marqueeRef = useRef(null);

  // Simulate continuous horizontal scrolling
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    let scrollAmount = 0;
    const speed = 1; // Adjust speed as needed
    let animationId;

    const animate = () => {
      if (scrollAmount >= el.scrollWidth / 2) {
        scrollAmount = 0;
        animationId = requestAnimationFrame(animate);
      }
      scrollAmount += speed;
      el.scrollLeft = scrollAmount;
      requestAnimationFrame(animate);
    };

     const handleResize = () => {
      cancelAnimationFrame(animationId);
      scrollAmount = 0;
      el.scrollLeft = 0;
      if (window.innerWidth > 768) { // Only animate on desktop
        animationId = requestAnimationFrame(animate);
      }
    };

    if (window.innerWidth > 768) {
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setShowLoader(true);

    // Simulate API call or loading time
    setTimeout(() => {
      navigate('/register');
    }, 2000); // Wait 2 seconds
  };



 // Responsive navbar toggle for mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  
  return (
    <div className="bg-white text-gray-800 overflow-x-hidden">



      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md px-10 py-4 flex justify-between items-center">
        {/* Logo & Site Name */}
        <div className="flex items-center space-x-2">
          {/* Icon Placeholder */}
          <div className="w-12 h-12 rounded flex items-center justify-center text-white">📝</div>
          <h1 className="font-bold text-2xl">Clarity</h1>
        </div>


         {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>



        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Made For Dropdown */}
          <div className="group relative">
            <span className="cursor-pointer font-semibold px-3 py-2 rounded hover:bg-gray-200 transition-all">
              Made For
            </span>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded mt-2 w-48 border border-gray-200">
              <ul className="py-2 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2">
                  <span>✅</span>
                  <span>Task Management</span>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2">
                  <span>📁</span>
                  <span>Project Management</span>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2">
                  <span>⏱️</span>
                  <span>Time Management</span>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2">
                  <span>🎨</span>
                  <span>Hobby Creation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Resources Dropdown */}
          <div className="group relative">
            <span className="cursor-pointer font-semibold px-3 py-2 rounded hover:bg-gray-200 transition-all">
              Resources
            </span>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded mt-2 w-40 border border-gray-200">
              <ul className="py-2 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">About</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Templates</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Getting Started</li>
              </ul>
            </div>
          </div>


          <span className="text-gray-400">|</span>
          {/* Login Link */}
          <a href="/login" className="hover:bg-gray-100 font-medium px-3 py-2 rounded">Login</a>
          <a href="/register" onClick={handleRegisterClick} className="hover:bg-red-700 bg-red-500 px-4 py-2 font-medium font-bold text-white rounded-sm">Get Started</a>
        </div>


         {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6">
            <div className="flex flex-col space-y-4">
              <a href="/login" className="px-3 py-2 rounded hover:bg-gray-100">Login</a>
              <a href="/register" onClick={handleRegisterClick} className="bg-red-500 text-white px-4 py-2 rounded">
                Get Started
              </a>
            </div>
          </div>
        )}


      </nav>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row items-center justify-between sm:px-8 md:py-20 px-8 py-30 max-w-7xl mx-auto">
        {/* Left Side Text */}
        <div className="md:w-1/2 space-y-6 mb-10 md:mb-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Finally get clarity on<br></br> what’s next.
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Join 50+ million professionals who simplify work<br></br> and life with the world’s #1 to-do list app.
          </p>

          {/* Icons & Reviews */}
          <div className="flex flex-wrap gap-3 text-sm sm:text-base items-center text-gray-500">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18.592 15.469c-.007.754-.917 2.397-1.96 3.765-.996 1.3-2.048 2.676-3.656 2.649-1.616.027-2.546-1.058-3.96-2.966-.885-1.222-1.823-2.518-1.816-4.124.007-.966.486-1.896 1.495-2.558.986-.654 1.637-.852 2.619-.845.986-.007 1.665.265 2.55.927.856.654 1.263 1.411 1.27 2.384-.007.428-.141.836-.395 1.203-.246.367-.593.633-1.056.625-.463.007-.81-.314-1.243-.845-.434-.545-.944-1.263-1.056-2.193-.112-.93-.007-1.746.463-2.337.463-.593 1.178-.914 2.055-.921 1.063-.007 1.926.473 1.933 1.565-.007.566-.253 1.077-.723 1.537-.486.473-1.038.654-1.665.661-.619.007-1.13-.181-1.53-.619-.395-.441-.576-1.011-.576-1.747 0-.746.246-1.418.723-1.949.486-.531 1.146-.81 1.933-.81 1.092 0 1.984.466 1.991 1.594-.007.545.232 1.011.712 1.435.473.414 1.043.625 1.684.632.649.007 1.178-.188 1.616-.602.441-.421.673-.945.68-.159-.007.042.265.265.642.395.414.945.795 1.616 1.118.673.323 1.395.511 2.196.518 1.165.007 2.139-.459 2.146-1.455.007-.486-.169-1.024-.511-1.616-.343-.6-.817-1.234-1.394-1.896-.582-.661-1.27-1.292-2.043-1.874-.773-.589-1.616-1.113-2.533-1.544-.924-.434-1.905-.734-2.936-.896-1.031-.162-2.062-.176-2.972.014-1.905.387-3.234 1.439-3.241 3.138-.007.923.36 1.753 1.113 2.574.76 0.828 1.766 1.705 2.984 2.574C9.79 13.384 10.962 14.275 12.205 15.189c1.236.907 2.518 1.831 3.973 1.803 0 0 1.017-.217 1.017-.217.655-.176 1.038-.723 1.045-1.411Zm-.092-6.141c-.007-.986.753-1.783 1.735-1.79-.985-.007-1.745.81-1.735 1.79Z" fill="currentColor"/>
</svg>
          <span>|</span>
          {/* Android Icon */}
<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
  <path d="M17 11H13V7H11V11H7V13H11V17H13V13H17V11ZM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2Z" />
</svg>
          <span>|</span>
          <span>374K+ ★★★★★ reviews</span>
        </div>

          {/* Start Free Button */}
          <button className="mt-4 bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700 transition cursor-pointer text-xl">
            Start for free
          </button>
        </div>

        {/* Right Side Image Placeholder */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img src="/images/hero img.avif"
            alt="Clarity App Preview"
            className="rounded shadow-lg max-w-full h-auto"
          />
        </div>
      </main>

      {/* Testimonial Section */}
<div className="mt-10 md:mt-20 px-4 text-center">
  <h2 className="text-xl sm:text-lg font-medium text-gray-600 mb-8">Trusted by millions</h2>

  <div className="flex flex-col md:flex-row sm:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-10">
    {/* Testimonial 1 */}
    <div className="text-center">
      <p className="font-normal italic text-lg">Simple, straightforward,<br></br> and super powerful</p>
      <div className="mt-3 flex items-center justify-center space-x-2">
        <img src="/images/producthunt.avif" alt="Company Logo" className="h-14" />
      </div>
    </div>
        <span className="text-gray-400 ">|</span>

    {/* Testimonial 2 */}
    <div className="text-center">
      <p className="font-normal italic text-lg">The best to-do list app<br></br> on the market</p>
      <div className="mt-3 flex items-center justify-center space-x-2">
        <img src="/images/techcrunch.png" alt="Company Logo" className="h-14" />
      </div>
    </div>
        <span className="text-gray-400">|</span>

    {/* Testimonial 3 */}
    <div className="text-center">
      <p className="font-normal italic text-lg">Nothing short of stellar</p>
      <div className="mt-3 flex items-center justify-center space-x-2">
        <img src="/images/theverge.png" alt="Company Logo" className="h-14" />
      </div>
    </div>
  </div>
</div>


  {/* Feature Sections – Scrollable Left / Fixed Right */}
  <div className="flex flex-col lg:flex-row md:mt-20 mt-40">
        
        {/* Left Side - Scrollable Content */}
        <div className="lg:w-1/2 p-8 space-y-100 overflow-y-auto max-h-screen lg:max-h-full mt-40 ml-20 sm:mx-auto sm:mb-20">
          {sections.map((section, index) => (
            <div key={index} className="scroll-mt-20">
              <h2 className={`text-xl sm:text-lg font-bold mb-8 ${section.colorClass}`}>{section.title}</h2>
              <h3 className="text-4xl sm:text-2xl font-bold text-gray-600 mb-8">{section.subtitle}</h3>
              <p className="text-gray-500 text-2xl sm:text-lg leading-relaxed">{section.description}</p>
              
              {/* Show link only after the last section */}
      {index === sections.length - 1 && (
        <div className="mt-6 text-sm text-gray-500">
          
          <a 
            href="https://www.whisperingcodes.com/" 
            rel="noopener noreferrer"
            className="text-blue-600 text-normal font-bold hover:bg-blue-50 px-3 py-3 rounded transition-all hover:text-blue-800"
          >
            Learn more about task management
          </a>
        </div>
      )}
            </div>
          ))}
          
          
        </div>

        {/* Right Side - Fixed Image */}
        <div className="lg:w-1/2 lg:block h-64 lg:h-screen sticky top-0 self-start flex items-center justify-center bg-gray-100">
          <img
            src="/images/hero img.avif"
            alt="Feature Preview"
            className="w-full h-full object-cover"
          />
        </div>

  </div>

      
      {/* Template Section */}
      <section className="py-60 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-4xl sm:text-3xl font-bold mb-8">Kickstart your next project with Clarity Templates</h2>
          <p className="text-lg sm:text-base text-gray-600 mb-20">
            No need to create projects or setups from scratch when we have<br></br> 50+ templates made for you.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((filter, idx) => (
            <button
              key={idx}
              className={`px-5 py-3 rounded-lg border bg-gray-100 border-gray-300 hover:bg-gray-200 transition cursor-pointer sm:text-base font-bold`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              
              {/* Top Color Background */}
              <div className={`${card.bgColor} p-12 flex justify-center items-center border-b border-gray-200`}>
                <span className="text-3xl sm:text-2xl">{card.icon}</span>
              </div>

              {/* Bottom Content */}
              <div className="p-6 sm:p-4">
                <h3 className="font-bold text-md sm:text-base mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-4 text-md sm:text-sm">{card.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>📄</span>
                  <span className="ml-2">List</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link */}
        <div className='mt-10 md:mt-12 text-center'>
        <a href="https://www.whisperingcodes.com/" rel="noopener noreferrer" className="text-blue-600 text-normal font-semibold hover:bg-blue-50 px-3 py-3 rounded transition-all hover:text-blue-800">See more templates </a>
        </div>
      </section>


      {/* Smart Features Section */}
      <section className='py-5 px-6 bg-gray-50'>
      <div className='flex flex-row lg:flex-row items-center gap-x-36 lg:space-y-0 lg:space-x-10'>
        <div className='md:w-1/2 flex justify-center'> 
          <img src="/images/hero img.avif" alt="Smart Features" className="h-auto rounded-lg shadow-md mb-10" />
        </div>
        <div className='mr-10 md:w-1/2'>
        <h2 className='text-4xl font-bold mb-8'>Smart features that <br></br>feel magical</h2>
        <p className='text-gray-600 text-lg font-semibold'>Clarity is more than just a to-do<br></br>list app. It’s a smart assistant that<br></br> helps you stay organized, focused, and productive.</p>
        <ul className='list-disc list-inside text-gray-600 text-lg mt-4'>
          <li>AI-powered task suggestions</li>
          <li>Smart scheduling and reminders</li>
          <li>Collaborative team features</li>
          <li>Customizable workflows</li>
        </ul>
        <div className='mt-6'>
          <a href="https://www.whisperingcodes.com/" rel="noopener noreferrer" className="text-blue-600 text-normal font-semibold hover:bg-blue-50 px-3 py-3 rounded transition-all hover:text-blue-800">Learn about our thoughtful approach to AI</a>
          </div>
        </div>
      </div>
      </section>



     

      {/* Long-Term Mission Section */}
    <section className="py-10 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* Left Side Text */}
        <div className="lg:w-1/2 space-y-6 ml-14">
          <span className="text-red-700 text-lg font-medium">In it for the long haul</span>
          <h2 className="text-3xl md:text-4xl mt-6 font-bold leading-tight">
            A task manager you can<br></br> trust for life
          </h2>
          <p className="text-gray-600 mt-4 max-w-lg text-xl">
            We’ve been building Todoist for 18 years and 152 <br></br>days. Rest assured that we’ll never sell out to the<br></br> highest bidder.
          </p>

          {/* Link with Icon */}
          <a href="/mission" className="inline-flex items-center text-blue-600  hover:bg-blue-50 px-3 py-2 rounded mt-4 text-lg">
            <span>📖</span>
            <span className="ml-2 font-medium">Read about our long-term mission</span>
          </a>
        </div>

        {/* Right Side – Auto Scrolling Marquee Images */}
        <div className="lg:w-1/2 w-full overflow-hidden whitespace-nowrap relative">
          <div
            ref={marqueeRef}
            className="flex animate-marquee"
            style={{ width: '150%' }}
          >
            {/* Duplicate images to create seamless loop */}
            {['img1.avif', 'img2.avif', 'img3.avif', 'img4.avif'].map((img, idx) => {
              const labelMap = {
                'img1.avif': '160+ countries worldwide',
                'img2.avif': '1+ million pro users',
                'img3.avif': '30+ million app downloads',
                'img4.avif':'2+ billion tasks completed'
              };
              const label = labelMap[img];
              return (
        <div key={idx} className="w-1/3 flex-shrink-0 mx-4 text-center">
          <img
            src={`/images/${img}`}
            alt={label}
            className="rounded shadow-md w-full h-50"
          />
          <p className="mt-2 text-lg text-gray-700">
    <BoldFirstPart text={label} />
  </p>
        
        </div>
      );
    })}

    {/* Duplicate for seamless scroll */}
    {['img1.avif', 'img2.avif', 'img3.avif', 'img4.avif'].map((img, idx) => {
      const labelMap = {
        'img1.avif': '160+ countries worldwide',
                'img2.avif': '1+ million pro users',
                'img3.avif': '30+ million app downloads',
                'img4.avif':'2+ billion tasks completed'
      };

      const label = labelMap[img];

      return (
        <div key={`copy-${idx}`} className="w-1/3 flex-shrink-0 mx-4 text-center">
          <img
            src={`/images/${img}`}
            alt={label}
            className="rounded shadow-md w-full h-auto"
          />
           <p className="mt-2 text-lg text-gray-700">
           <BoldFirstPart text={label} />
           </p>
        </div>
      );
    })}
  </div>
</div>
        </div>

            
      {/* Add custom animation keyframes */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 100%;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>




    {/* Last section */}
    <section className="py-16 px-6 bg-gradient-to-b from-pink-50 via-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl/12 font-bold mt-10 mb-10">Gain calmness and clarity with the<br></br> world’s most beloved productivity app
          </h2>
          <p className="text-lg">374000+ ★★★★★ reviews on Google Play and App Store
          </p>
          <a href="/register" className="bg-red-600 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-red-700 transition cursor-pointer text-xl mt-10 inline-block">
            Start for free
          </a><br></br>

            <a href="/login" className="text-gray-500 font-semibold hover:text-gray-800 hover:bg-gray-200 mt-5 px-1 py-2 inline-flex items-center space-x-1">
            <span>📖</span>
            <span>Download apps</span>
            </a>
        </div>
    


    {/* Footer */}
    <footer className="mt-20 pt-16 border-t border-gray-300 text-gray-800">
  {/* Top Line + Content */}
  <div className="max-w-7xl px-6">
    <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
      {/* Left Column */}
      <div className="md:w-1/4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="w-14 h-14 bg-black-500 rounded flex items-center justify-center text-white">📝</span>
          <h3 className="text-3xl font-bold">Clarity</h3>
        </div>
        <p className="text-xl text-gray-900">
          Join millions of people who organize work and life with Clarity.
        </p>
      </div>




      {/* Right Columns – Features, Resources, Company, Social */}
      <div className="md:flex md:space-x-10 lg:space-x-10 gap-10 xl:space-x-12">
      {/* Features Column */}
      <div className="mb-6 md:mb-0">
        <h4 className="font-bold text-gray-900 text-lg mb-7">Features</h4>
        <ul className="space-y-3 font-semibold text-gray-900">
          <li><a href="/how-it-works" className="hover:text-red-300 ">How It Works</a></li>
          <li><a href="/teams" className="hover:text-red-300">For Teams</a></li>
          <li><a href="/pricing" className="hover:text-red-300">Pricing</a></li>
          <li><a href="/templates" className="hover:text-red-300">Templates</a></li>
        </ul>
      </div>

      {/* Resources Column */}
      <div className="mb-6 md:mb-0">
        <h4 className="font-bold text-gray-900 text-lg  mb-7">Resources</h4>
        <ul className="space-y-3 text-md font-semibold text-gray-900">
          <li><a href="/apps" className="hover:text-red-300">Download Apps</a></li>
          <li><a href="/help" className="hover:text-red-300
          ">Help Center</a></li>
          <li><a href="/methods" className="hover:text-red-300
          ">Productivity Methods</a></li>
          <li><a href="/integrations" className="hover:text-red-300
          ">Integrations</a></li>
          <li><a href="/partners" className="hover:text-red-300
          ">Channel Partners</a></li>
          <li><a href="/api" className="hover:text-red-300
          ">Developer API</a></li>
          <li><a href="/status" className="hover:text-red-300
          ">Status</a></li>
        </ul>
      </div>

      {/* Company Column */}
      <div className="mb-6 md:mb-0">
        <h4 className="font-bold text-gray-900 text-lg mb-7">Company</h4>
        <ul className="space-y-3 font-semibold text-gray-900">
          <li><a href="/about" className="hover:text-red-300
          ">About Us</a></li>
          <li><a href="/careers" className="hover:text-red-300
          ">Careers</a></li>
          <li><a href="/inspiration" className="hover:text-red-300
          ">Inspiration Hub</a></li>
          <li><a href="/press" className="hover:text-red-300
          ">Press</a></li>
          <li><a href="/twist" className="hover:text-red-300
          ">Twist</a></li>
        </ul>
      </div>

      {/* Social / Language Column */}
      <div className="mb-6 md:mb-0">
        <div className="flex flex-col items-center space-y-8 mt-2 mb-10">
          <a href="https://youtube.com " target="_blank" rel="noopener noreferrer" className="text-sm">
            <img src="/images/youtube.svg" alt="YouTube" className="w-4 h-4 mb-2" />
          </a>

          <a href="https://linkedin.com " target="_blank" rel="noopener noreferrer" className="text-sm">
            <img src="/images/linkedin.svg" alt="LinkedIn" className="w-4 h-4 mb-2" />
          </a>

          <a href="https://instagram.com " target="_blank" rel="noopener noreferrer" className="text-sm">
            <img src="/images/instagram.svg" alt="Instagram" className="w-4 h-4 mb-2" />
          </a>


          <a href="https://reddit.com " target="_blank" rel="noopener noreferrer" className="text-sm">
            <img src="/images/reddit.svg" alt="Reddit" className="w-4 h-4 mb-2" />
          </a>
        </div>

        
      </div>
      </div>
    </div>

    {/* Bottom Row */}
    <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-900">
      {/* Legal Links & Copyright */}
      <div className="flex flex-wrap items-center font-semibold gap-2 mb-4 md:mb-0">
        <span className='cursor-pointer'>Security</span>
        <span className="hidden sm:inline ">•</span>
        <span className='cursor-pointer'>Privacy</span>
        <span className="hidden sm:inline">•</span>
        <span className='cursor-pointer'>Terms</span>
        <span className="hidden sm:inline">•</span>
        <span className='cursor-pointer'>© Doist Inc.</span>
      </div>

      {/* Language Button */}
      <div className="relative inline-block">
  {/* Language Button */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="bg-gray-200 px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-300 transition"
  >
    <span>🌐</span>
    <span>English</span>
  </button>

  {/* Dropdown positioned ABOVE the button */}
  {isOpen && (
    <div className="absolute -top-10 left-0 w-40 bg-white shadow-lg rounded border border-gray-200 z-10">
      <ul className="py-2 text-sm">
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Español</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Français</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Português</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Deutsch</li>
      </ul>
    </div>
  )}
</div>





    </div>
  </div>
</footer>
    </section>



    {showLoader && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="text-center">
            {/* Logo */}
            {/* Spinner */}
            <div className="mt-4 w-10 h-10 border-4 border-blue-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}

    </div>
  );
}