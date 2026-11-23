import React, { useEffect, useState } from 'react';
import { company } from '../../content/site';

export default function WhatsAppButton() {
  const text = encodeURIComponent('Hello Tattva Tech, I would like to discuss a project.');
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a
      href={`https://wa.me/${company.whatsappNumber}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Tattva Tech on WhatsApp"
      className={`group fixed bottom-5 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition-all duration-500 hover:scale-105 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C8.833 3 3.004 8.82 3.004 15.98c0 2.29.6 4.53 1.74 6.5L3 29l6.7-1.76a13 13 0 0 0 6.3 1.6h.01C23.18 28.84 29 23.02 29 15.86 29 12.4 27.65 9.14 25.2 6.7A12.9 12.9 0 0 0 16.004 3Zm0 23.66h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.24-3.98 1.04 1.06-3.88-.26-.4a10.7 10.7 0 0 1-1.65-5.72c0-5.95 4.85-10.8 10.8-10.8 2.88 0 5.6 1.12 7.63 3.16a10.7 10.7 0 0 1 3.16 7.64c0 5.95-4.85 10.7-10.85 10.7Zm5.92-8.03c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.16-.22.33-.84 1.06-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.5-2.62-1.6-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.36c.16.22 2.3 3.5 5.56 4.91.78.33 1.38.53 1.86.68.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.13-.3-.21-.62-.37Z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
