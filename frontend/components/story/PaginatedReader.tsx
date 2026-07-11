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
  const columnsRef = useRef<HTMLDivElement>(null);

  const calculatePages = () => {
    if (columnsRef.current) {
      const scrollW = columnsRef.current.scrollWidth;
      const clientW = columnsRef.current.clientWidth;
      // We assume 2rem gap = 32px
      // It's safer to measure gap dynamically, but standard 32px is used in our CSS.
      const gap = 32;
      const total = Math.round((scrollW + gap) / (clientW + gap));
      const finalTotal = total > 0 ? total : 1;
      setTotalPages(finalTotal);
      
      setCurrentPage((prev) => (prev >= finalTotal ? finalTotal - 1 : prev));
    }
  };

  useEffect(() => {
    // Biraz gecikmeli hesaplama, görsellerin vb. yüklenmesi için
    const timer = setTimeout(calculatePages, 100);
    window.addEventListener("resize", calculatePages);
    return () => {
      clearTimeout(timer);
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
          }}
        >
          <div className={styles.coverPage}>
            {coverImage ? (
              <img src={coverImage} alt="" className={styles.cover} />
            ) : null}
            <h1 className={styles.title}>{title}</h1>
            {date ? <time className={styles.date}>{date}</time> : null}
          </div>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className="btn"
          onClick={goToPrev}
          disabled={currentPage === 0}
        >
          &larr; {prevLabel}
        </button>
        <span className={styles.pageIndicator}>
          {currentPage + 1} / {totalPages}
        </span>
        <button
          type="button"
          className="btn"
          onClick={goToNext}
          disabled={currentPage >= totalPages - 1}
        >
          {nextLabel} &rarr;
        </button>
      </div>
    </div>
  );
}
