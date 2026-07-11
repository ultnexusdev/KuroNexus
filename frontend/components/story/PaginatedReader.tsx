"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./PaginatedReader.module.css";

interface PaginatedReaderProps {
  title: string;
  content: string;
  coverImage?: string;
  date?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export function PaginatedReader({
  title,
  content,
  coverImage,
  date,
  prevLabel = "Önceki",
  nextLabel = "Sonraki",
}: PaginatedReaderProps) {
  const [globalCurrentPage, setGlobalCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [partPages, setPartPages] = useState<number[]>([]);
  const [colWidth, setColWidth] = useState<number | undefined>(undefined);
  const [isEditingPage, setIsEditingPage] = useState(false);
  
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Split the content into chunks at every <hr>
  const parts = useMemo(() => {
    return content.split(/<hr[^>]*>/i);
  }, [content]);

  const handlePageSubmit = (val: string) => {
    const pageNum = parseInt(val, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setGlobalCurrentPage(pageNum - 1);
    }
    setIsEditingPage(false);
  };

  const calculatePages = () => {
    let newPartPages: number[] = [];
    let cWidth: number | undefined = undefined;

    parts.forEach((_, i) => {
      const el = containerRefs.current[i];
      if (el) {
        const clientW = el.clientWidth;
        if (clientW > 0 && !cWidth) {
          cWidth = clientW;
        }
        
        const scrollW = el.scrollWidth;
        const gap = 32; // var(--column-gap)
        
        const total = Math.round((scrollW + gap) / (clientW + gap));
        newPartPages.push(total > 0 ? total : 1);
      } else {
        newPartPages.push(1);
      }
    });

    if (cWidth) setColWidth(cWidth);
    
    // Sadece dizi değiştiyse güncelle
    setPartPages((prev) => {
      if (prev.length === newPartPages.length && prev.every((v, i) => v === newPartPages[i])) {
        return prev;
      }
      return newPartPages;
    });
    
    const finalTotal = newPartPages.reduce((acc, val) => acc + val, 0) || 1;
    setTotalPages(finalTotal);
    
    setGlobalCurrentPage((prev) => (prev >= finalTotal ? finalTotal - 1 : prev));
  };

  useEffect(() => {
    calculatePages();
    
    const timer = setTimeout(calculatePages, 200);
    const timer2 = setTimeout(calculatePages, 1000);
    
    window.addEventListener("resize", calculatePages);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener("resize", calculatePages);
    };
  }, [parts, coverImage]);

  const goToPrev = () => {
    setGlobalCurrentPage((p) => Math.max(0, p - 1));
  };

  const goToNext = () => {
    setGlobalCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  };

  // Determine active part and local translation offset
  let remaining = globalCurrentPage;
  let activePartIndex = 0;
  let localOffset = 0;

  for (let i = 0; i < partPages.length; i++) {
    if (remaining < partPages[i]) {
      activePartIndex = i;
      localOffset = remaining;
      break;
    }
    remaining -= partPages[i];
  }

  return (
    <div className={styles.container}>
      <div className={styles.viewport}>
        {parts.map((part, index) => {
          const isActive = index === activePartIndex;
          return (
            <div
              key={index}
              ref={(el) => {
                containerRefs.current[index] = el;
              }}
              className={`${styles.columns} ${isActive ? styles.activePart : styles.inactivePart}`}
              style={{
                transform: isActive 
                  ? `translateX(calc(-${localOffset} * (100% + var(--column-gap))))` 
                  : "translateX(0)",
                columnWidth: colWidth ? `${colWidth}px` : "100%",
              }}
            >
              {index === 0 && (
                <div className={styles.coverPage}>
                  {coverImage ? (
                    <img src={coverImage} alt="" className={styles.cover} />
                  ) : null}
                  <h1 className={styles.title}>{title}</h1>
                  {date ? <time className={styles.date}>{date}</time> : null}
                </div>
              )}
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: part }}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className="btn"
          onClick={goToPrev}
          style={{ visibility: globalCurrentPage === 0 ? "hidden" : "visible" }}
        >
          &larr; {prevLabel}
        </button>
        <span className={styles.pageIndicator}>
          {isEditingPage ? (
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={globalCurrentPage + 1}
              autoFocus
              onBlur={(e) => handlePageSubmit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePageSubmit(e.currentTarget.value);
                } else if (e.key === "Escape") {
                  setIsEditingPage(false);
                }
              }}
              className={styles.pageInput}
            />
          ) : (
            <span
              onClick={() => setIsEditingPage(true)}
              title="Sayfaya gitmek için tıklayın"
              style={{ cursor: "pointer" }}
            >
              {globalCurrentPage + 1}
            </span>
          )}
          {" / " + totalPages}
        </span>
        <button
          type="button"
          className="btn"
          onClick={goToNext}
          style={{
            visibility: globalCurrentPage >= totalPages - 1 ? "hidden" : "visible",
          }}
        >
          {nextLabel} &rarr;
        </button>
      </div>
    </div>
  );
}
