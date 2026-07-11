"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [colWidth, setColWidth] = useState<number | undefined>(undefined);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const columnsRef = useRef<HTMLDivElement>(null);

  const handlePageSubmit = (val: string) => {
    const pageNum = parseInt(val, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum - 1);
    }
    setIsEditingPage(false);
  };

  const calculatePages = () => {
    if (columnsRef.current) {
      const clientW = columnsRef.current.clientWidth;
      if (clientW > 0) {
        setColWidth(clientW);
      }
      
      const scrollW = columnsRef.current.scrollWidth;
      const gap = 32;
      const total = Math.round((scrollW + gap) / (clientW + gap));
      const finalTotal = total > 0 ? total : 1;
      setTotalPages(finalTotal);
      
      setCurrentPage((prev) => (prev >= finalTotal ? finalTotal - 1 : prev));
    }
  };

  useEffect(() => {
    // Initial calculate
    calculatePages();
    
    // Gecikmeli hesaplama, görseller vb. için
    const timer = setTimeout(calculatePages, 200);
    const timer2 = setTimeout(calculatePages, 1000); // Ekstra garanti
    
    window.addEventListener("resize", calculatePages);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener("resize", calculatePages);
    };
  }, [content, coverImage]);

  const goToPrev = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
  };

  const goToNext = () => {
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.viewport}>
        <div
          ref={columnsRef}
          className={styles.columns}
          style={{
            transform: `translateX(calc(-${currentPage} * (100% + var(--column-gap))))`,
            columnWidth: colWidth ? `${colWidth}px` : "100%",
          }}
        >
          <div className={styles.coverPage}>
            {coverImage ? (
              <img src={coverImage} alt="" className={styles.cover} />
            ) : null}
            <h1 className={styles.title}>{title}</h1>
            {date ? <time className={styles.date}>{date}</time> : null}
          </div>
          {content.split(/<hr[^>]*>/i).map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <div className={styles.pageBreakSpacer} />}
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: part }}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className="btn"
          onClick={goToPrev}
          style={{ visibility: currentPage === 0 ? "hidden" : "visible" }}
        >
          &larr; {prevLabel}
        </button>
        <span className={styles.pageIndicator}>
          {isEditingPage ? (
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage + 1}
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
              {currentPage + 1}
            </span>
          )}
          {" / " + totalPages}
        </span>
        <button
          type="button"
          className="btn"
          onClick={goToNext}
          style={{
            visibility: currentPage >= totalPages - 1 ? "hidden" : "visible",
          }}
        >
          {nextLabel} &rarr;
        </button>
      </div>
    </div>
  );
}
