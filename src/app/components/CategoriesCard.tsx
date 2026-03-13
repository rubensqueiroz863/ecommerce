export default function CategoriesCard() {
  const categories = [
    {
      name: "Computers & Accessories",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth="2"/>
          <path d="M8 20h8M12 16v4" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: "Cameras, Audio & Video",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="7" width="15" height="10" rx="2" strokeWidth="2"/>
          <circle cx="10.5" cy="12" r="3" strokeWidth="2"/>
          <path d="M18 10l3-2v8l-3-2z" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: "Smartphones And Phones",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2"/>
          <circle cx="12" cy="18" r="1" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: "Laptops And Tablets",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="4" y="5" width="16" height="10" rx="2" strokeWidth="2"/>
          <path d="M2 19h20" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: "TV And Display",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth="2"/>
          <path d="M8 20h8" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: "Watches & Eyewear",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="6" strokeWidth="2"/>
          <path d="M12 8v4l2 2" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: "Headphones And Speakers",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 12a8 8 0 0116 0" strokeWidth="2"/>
          <rect x="3" y="12" width="4" height="6" rx="1" strokeWidth="2"/>
          <rect x="17" y="12" width="4" height="6" rx="1" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: "Accessories",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" strokeWidth="2"/>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <div className="lex w-fit md:text-[14px] text-[12px] flex-col text-(--text-dark)">
      {categories.map(({ name, icon }) => (
        <div key={name} className="flex flex-col hover:opacity-60 cursor-pointer transition-all">
          <div className="flex relative pr-5 items-center gap-3">
            {icon}
            <p>{name}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-0 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 6l6 6-6 6"/>
            </svg>

          </div>
          <span className="block my-2 w-full h-px bg-(--bg-secondary)"></span>
        </div>
      ))}
    </div>
  );
}
