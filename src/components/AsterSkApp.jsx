import React, { useState, useRef, useEffect } from 'react';
import GridOverlay from './GridOverlay';

// Constants
const FONT_FAMILY = '"Inconsolata", "Inconsolata Nerd Font", monospace';
const GRID_COMMANDS = ['::grid', '--grid', '/grid'];
const MIDNIGHT_CHECK_INTERVAL = 60000; // 1 minute
const SCROLL_DELAY = 600;
const FADE_THRESHOLD = 20;
const TIME_INTERVAL_MINUTES = 5;

const AsterSkApp = () => {
  const [inputValue, setInputValue] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const [lastLogTime, setLastLogTime] = useState(null); // Track last entry time
  const [lastLogDate, setLastLogDate] = useState(null); // Track last entry date
  const inputRef = useRef(null);
  const textRef = useRef(null);
  const journalRef = useRef(null);
  const gridOverlayRef = useRef(null);

  // Helper functions
  const formatDateTime = (date) => ({
    date: date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  });

  const createRoundedTime = (date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.floor(minutes / TIME_INTERVAL_MINUTES) * TIME_INTERVAL_MINUTES;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      roundedMinutes,
      0,
      0
    );
  };

  // Function to break long text into sentences for better readability
  const formatTextWithSentenceBreaks = (text) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    // Only apply sentence breaking if more than 3 paragraphs
    if (paragraphs.length <= 3) {
      return text;
    }
    
    // Break each paragraph into sentences and add line breaks
    const processedParagraphs = paragraphs.map(paragraph => {
      // Split by sentence endings (. ! ?) followed by space or end of string
      const sentences = paragraph.split(/([.!?])\s+/).filter(s => s.trim());
      
      let result = '';
      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i];
        const punctuation = sentences[i + 1] || '';
        
        if (sentence && sentence.trim()) {
          result += sentence.trim() + punctuation;
          
          // Add line break after each sentence (except the last one)
          if (i + 2 < sentences.length) {
            result += '\n';
          }
        }
      }
      
      return result;
    });
    
    return processedParagraphs.join('\n\n');
  };

  useEffect(() => {
    // Auto-focus on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Set up midnight date marker system
    const checkMidnight = () => {
      const now = new Date();
      const currentDateString = now.toDateString();
      
      // If it's a new date and we have entries, add a date marker entry
      if (lastLogDate && lastLogDate !== currentDateString && journalEntries.length > 0) {
        const { date } = formatDateTime(now);
        const dateMarkerEntry = {
          id: Date.now(),
          text: '',
          timestamp: null,
          dateMarker: date,
          isAutoDateMarker: true
        };
        
        setJournalEntries(prev => [dateMarkerEntry, ...prev]);
        setLastLogDate(currentDateString);
      }
    };
    
    // Check for midnight every minute
    const midnightInterval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        checkMidnight();
      }
        }, MIDNIGHT_CHECK_INTERVAL);
    
    // Handle keyboard shortcuts
    const handleKeyDown = (e) => {
      // Ctrl+A to select visible text
      if (e.ctrlKey && e.key === 'a' && inputValue && textRef.current) {
        e.preventDefault();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      // Enter to save text to journal
      else if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        handleSubmitEntry();
      }
    };
    
    const handleSubmitEntry = () => {
      if (!inputValue.trim()) return;
      
      const now = new Date();
      const currentIntervalTime = createRoundedTime(now);
      const currentDateString = now.toDateString();
      const { date, time } = formatDateTime(currentIntervalTime);
      
      // Check for date marker
      const needsDateMarker = !lastLogDate || lastLogDate !== currentDateString;
      if (needsDateMarker) {
        setLastLogDate(currentDateString);
      }
      
      // Check for timestamp
      const needsTimestamp = !lastLogTime || currentIntervalTime.getTime() !== lastLogTime.getTime();
      if (needsTimestamp) {
        setLastLogTime(currentIntervalTime);
      }
      
      const processedText = formatTextWithSentenceBreaks(inputValue.trim());
      const newEntry = {
        id: Date.now(),
        text: processedText,
        timestamp: needsTimestamp ? time : null,
        dateMarker: needsDateMarker ? date : null
      };
      
      setJournalEntries(prev => [newEntry, ...prev]);
      setInputValue('');
      
      // Dramatic delayed scroll to top with smooth animation
      setTimeout(() => {
        if (journalRef.current) {
          journalRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, SCROLL_DELAY);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Handle scroll to show/hide top fade
    const handleScroll = () => {
      if (journalRef.current) {
        const scrollTop = journalRef.current.scrollTop;
        setShowTopFade(scrollTop > FADE_THRESHOLD);
      }
    };
    
    if (journalRef.current) {
      journalRef.current.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (journalRef.current) {
        journalRef.current.removeEventListener('scroll', handleScroll);
      }
      clearInterval(midnightInterval);
    };
  }, [inputValue, lastLogDate]);

  return (
    <div 
      className="min-h-screen relative"
      style={{ backgroundColor: '#000000' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Fixed input field positioned precisely at grid Line 2 (16.7%) and Column D (50%) */}
      <div 
        className="fixed"
        style={{
          top: '16.7%', // Grid Line 2
          left: '50%',  // Grid Column D (center)
          transform: 'translate(-50%, -50%)', // Center both horizontally and vertically on the grid intersection
          width: '80%',
          maxWidth: '600px',
          zIndex: 100
        }}
      >
        {/* Text display with seamless cursor integration */}
        <div 
          className="relative text-white text-center"
          style={{ 
            minHeight: '3rem', 
            position: 'relative',
            fontFamily: FONT_FAMILY,
            fontSize: '20px',
            fontWeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'text',
            WebkitUserSelect: 'text'
          }}
          onMouseDown={(e) => {
            // Allow text selection to work, but also focus input when clicking on empty area
            if (!inputValue && e.target === e.currentTarget) {
              e.preventDefault();
              inputRef.current?.focus();
            }
          }}
        >
          <div className="inline-flex items-baseline">
            {/* Center-expanding text */}
            {inputValue && (
              <span 
                ref={textRef}
                className="transition-all duration-200 ease-out"
                style={{
                  transform: 'scaleX(1)',
                  transformOrigin: 'center',
                  opacity: 1,
                  userSelect: 'text',
                  WebkitUserSelect: 'text',
                  MozUserSelect: 'text',
                  msUserSelect: 'text',
                  whiteSpace: 'pre-wrap',
                  maxWidth: '100%',
                  wordWrap: 'break-word'
                }}
              >
                {inputValue}
              </span>
            )}
            
            {/* Seamless cursor - asterisk positioned at end of text or center when empty */}
            <span 
              style={{
                color: '#ffffff',
                animation: 'pulse 1.5s infinite',
                marginLeft: inputValue ? '2px' : '0',
                transition: 'margin-left 0.2s ease-out',
                fontFamily: FONT_FAMILY,
                fontSize: '20px',
                fontWeight: 300
              }}
            >
              *
            </span>
          </div>
        </div>
        
        {/* Invisible input field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value;
            
            // Check for grid toggle keywords
            if (GRID_COMMANDS.includes(newValue)) {
              // Toggle grid and clear input
              if (gridOverlayRef.current) {
                gridOverlayRef.current.toggle();
              }
              setInputValue(''); // Clear the command
              return;
            }
            
            setInputValue(newValue);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-default text-center"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            caretColor: 'transparent',
            color: 'transparent',
            fontSize: '1px',
            fontFamily: 'monospace',
            pointerEvents: 'all'
          }}
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      
      {/* Isolated journaling container - positioned at grid Line 3 (33.3%) and Column D (50%) */}
      <div 
        className="fixed"
        style={{
          top: '33.3%', // Grid Line 3
          left: '50%',  // Grid Column D (center)
          transform: 'translate(-50%, 0)',
          width: '80%',
          maxWidth: '600px',
          height: '66.7vh', // Height spans to bottom of viewport
          zIndex: 1
        }}
      >
        <div 
          style={{
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
          }}
        >
          <div 
            ref={journalRef}
            className="text-white"
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '16px',
              fontWeight: 300,
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
              padding: '40px 0', // Padding for fade zones
              scrollBehavior: 'smooth' // Smooth scrolling for all interactions
            }}
          >
            {/* Hide scrollbar for webkit browsers */}
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          
          {journalEntries.length === 0 ? (
            <div 
              style={{
                textAlign: 'center',
                opacity: 0.3,
                marginTop: '40px'
              }}
            >
              Start typing and press Enter to create your first journal entry...
            </div>
          ) : (
            journalEntries.map((entry, index) => (
              <div 
                key={entry.id}
                style={{
                  marginBottom: '30px',
                  paddingBottom: '20px',
                  borderBottom: entry.timestamp ? '1px solid #222222' : 'none',
                  animation: index === 0 ? 'fadeInSlideDown 1.0s ease-out' : 'none',
                  transform: index === 0 ? 'translateY(0)' : 'none'
                }}
              >
                {entry.dateMarker && (
                  <div 
                    style={{
                      fontSize: '14px',
                      opacity: 0.7,
                      marginBottom: '15px',
                      textAlign: 'center',
                      fontWeight: '400',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {entry.dateMarker}
                  </div>
                )}
                {entry.timestamp && (
                  <div 
                    style={{
                      fontSize: '12px',
                      opacity: 0.5,
                      marginBottom: '10px',
                      textAlign: 'center',
                      fontWeight: '400',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {entry.timestamp}
                  </div>
                )}
                {entry.text && (
                  <div 
                    style={{
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}
                  >
                    {entry.text}
                  </div>
                )}
              </div>
            ))
          )}
          </div>
          
          {/* Top fade overlay - only visible when scrolling down to fade older entries */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: `
                linear-gradient(to bottom, 
                  transparent 0%, 
                  rgba(0,0,0,0.1) 20%, 
                  rgba(0,0,0,0.3) 50%, 
                  rgba(0,0,0,0.6) 80%, 
                  rgba(0,0,0,0.8) 100%
                )
              `,
              pointerEvents: 'none',
              zIndex: 2,
              opacity: showTopFade ? 1 : 0,
              transition: 'opacity 0.3s ease-out'
            }}
          />
          
          {/* Dramatic bottom fade overlay - fades entries going down */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: `
                linear-gradient(to top, 
                  #000000 0%, 
                  #000000 20%, 
                  rgba(0,0,0,0.95) 35%, 
                  rgba(0,0,0,0.8) 50%, 
                  rgba(0,0,0,0.5) 70%, 
                  rgba(0,0,0,0.2) 85%, 
                  transparent 100%
                )
              `,
              pointerEvents: 'none',
              zIndex: 2
            }}
          />
        </div>
      </div>
      
      {/* Grid overlay for development/debugging */}
      <GridOverlay ref={gridOverlayRef} />
    </div>
  );
};

export default AsterSkApp;
