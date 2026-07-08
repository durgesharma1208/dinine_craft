import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize,
  Download, ArrowLeft, Loader2, AlertCircle, BookOpen, FileText,
  SkipBack, SkipForward, Info, Book, ScrollText
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { fetchCatalogById } from '../../services/catalogService';
import { formatBytes, formatDate } from '../../utils/helpers';
import { SITE_URL } from '../../utils/siteUrl';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function CatalogViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const pageRefs = useRef({});

  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [scrollMode, setScrollMode] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCatalogById(id)
      .then(data => {
        if (!mounted) return;
        if (!data) { setError('Catalog not found'); return; }
        setCatalog(data);
      })
      .catch(() => { if (mounted) setError('Failed to load catalog'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages: pages }) => {
    setNumPages(pages);
  };

  const goToPage = useCallback((page) => {
    const p = Math.max(1, Math.min(page, numPages || 1));
    setPageNumber(p);
    if (scrollMode && pageRefs.current[p]) {
      pageRefs.current[p].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [numPages, scrollMode]);

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const zoomReset = () => setScale(1);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {}
  };

  useEffect(() => {
    const handleFS = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFS);
    return () => document.removeEventListener('fullscreenchange', handleFS);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(pageNumber + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPage(pageNumber - 1);
      if (e.key === 'Home') goToPage(1);
      if (e.key === 'End') goToPage(numPages || 1);
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') zoomReset();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'i' || e.key === 'I') setShowInfo(s => !s);
      if (e.key === 's' || e.key === 'S') setScrollMode(m => !m);
      if (e.key === 'Escape' && showInfo) setShowInfo(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pageNumber, numPages, showInfo, goToPage]);

  // Track visible pages in scroll mode for the page counter
  useEffect(() => {
    if (!scrollMode || !numPages) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const p = Number(entry.target.dataset.page);
          setPageNumber(p);
        }
      });
    }, { threshold: 0.1, rootMargin: '-80px 0px -60% 0px' });

    const refs = pageRefs.current;
    Object.values(refs).forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [scrollMode, numPages]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 size={32} className="animate-spin text-primary" />
          <div className="absolute inset-0 animate-ping opacity-20">
            <Loader2 size={32} className="text-primary" />
          </div>
        </div>
        <p className="text-sm text-gray-400 font-medium">Loading catalog...</p>
      </div>
    </div>
  );

  if (error || !catalog) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5]">
      <div className="text-center max-w-md px-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle size={36} className="text-red-300" />
        </div>
        <h1 className="font-display text-2xl text-[#28221a] mb-2">Catalog Not Found</h1>
        <p className="text-gray-400 text-sm mb-8">{error || 'The catalog you\'re looking for doesn\'t exist or has been removed.'}</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-all shadow-lg shadow-primary/20">
            <ArrowLeft size={14} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-[#1a1410] flex flex-col">
      <Helmet>
        <title>{catalog.title} — Dinine Craft Catalog</title>
        <meta name="description" content={catalog.description || `Browse our ${catalog.title} catalog`} />
        <meta property="og:title" content={`${catalog.title} — Dinine Craft Catalog`} />
        <meta property="og:description" content={catalog.description || `Browse our ${catalog.title} catalog`} />
        {catalog.cover_image_url && <meta property="og:image" content={catalog.cover_image_url} />}
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${SITE_URL}/catalog/${catalog.id}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: catalog.title,
          description: catalog.description,
          image: catalog.cover_image_url,
          fileFormat: 'application/pdf',
          numberOfPages: catalog.page_count || numPages,
        })}</script>
      </Helmet>

      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-[#1a1410]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-3 h-14 flex items-center justify-between gap-2">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate(-1)} className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex-shrink-0" title="Go back">
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0 hidden sm:block">
              <p className="text-sm font-semibold text-white/90 leading-tight truncate">{catalog.title}</p>
              <p className="text-[10px] text-white/40 truncate">
                {catalog.category?.name && <>{catalog.category.name} · </>}
                {numPages || catalog.page_count || '?'} pages
              </p>
            </div>
          </div>

          {/* Center: Zoom */}
          <div className="flex items-center gap-0.5 bg-white/[0.06] rounded-xl px-1.5 py-1">
            <button onClick={zoomOut} disabled={scale <= 0.5} className="p-1.5 text-white/50 hover:text-white disabled:opacity-25 transition-colors rounded-lg hover:bg-white/5" title="Zoom out">
              <ZoomOut size={15} />
            </button>
            <button onClick={zoomReset} className="px-2 text-xs font-medium text-white/70 hover:text-white transition-colors min-w-[3rem] text-center tabular-nums" title="Reset zoom">
              {Math.round(scale * 100)}%
            </button>
            <button onClick={zoomIn} disabled={scale >= 3} className="p-1.5 text-white/50 hover:text-white disabled:opacity-25 transition-colors rounded-lg hover:bg-white/5" title="Zoom in">
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            {/* Page nav (visible in page mode only) */}
            {!scrollMode && (
              <div className="hidden sm:flex items-center gap-0.5 bg-white/[0.06] rounded-xl px-1.5 py-1">
                <button onClick={() => goToPage(1)} disabled={pageNumber <= 1} className="p-1.5 text-white/50 hover:text-white disabled:opacity-25 transition-colors rounded-lg hover:bg-white/5" title="First page">
                  <SkipBack size={14} />
                </button>
                <button onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1} className="p-1.5 text-white/50 hover:text-white disabled:opacity-25 transition-colors rounded-lg hover:bg-white/5" title="Previous page">
                  <ChevronLeft size={14} />
                </button>
                <span className="flex items-center gap-0.5 px-2 text-xs font-medium text-white/70 min-w-[4rem] justify-center tabular-nums">
                  <input type="number" value={pageNumber} onChange={e => goToPage(Number(e.target.value))} min={1} max={numPages || catalog.page_count || 1}
                    className="w-8 text-center bg-transparent border-none outline-none text-xs font-semibold text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-white/30">/</span>
                  <span className="text-white/40">{numPages || catalog.page_count || '?'}</span>
                </span>
                <button onClick={() => goToPage(pageNumber + 1)} disabled={pageNumber >= (numPages || catalog.page_count || 1)} className="p-1.5 text-white/50 hover:text-white disabled:opacity-25 transition-colors rounded-lg hover:bg-white/5" title="Next page">
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => goToPage(numPages || 1)} disabled={pageNumber >= (numPages || 1)} className="p-1.5 text-white/50 hover:text-white disabled:opacity-25 transition-colors rounded-lg hover:bg-white/5" title="Last page">
                  <SkipForward size={14} />
                </button>
              </div>
            )}

            {/* Scroll/Page mode toggle */}
            <button
              onClick={() => setScrollMode(m => !m)}
              className={`p-2 transition-colors rounded-lg ${scrollMode ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              title={scrollMode ? 'Switch to page mode (S)' : 'Switch to scroll mode (S)'}
            >
              {scrollMode ? <ScrollText size={15} /> : <Book size={15} />}
            </button>

            <button onClick={() => setShowInfo(s => !s)}
              className={`p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5 ${showInfo ? 'bg-white/10 text-white' : ''}`} title="Info (I)">
              <Info size={15} />
            </button>
            <button onClick={toggleFullscreen} className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5" title={fullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}>
              {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            </button>
            <a href={catalog.pdf_url} download className="p-2 text-white/50 hover:text-primary transition-colors rounded-lg hover:bg-white/5" title="Download PDF">
              <Download size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Page indicator for scroll mode */}
      {scrollMode && numPages && (
        <div className="sticky top-14 z-40 bg-[#1a1410]/80 backdrop-blur-xl border-b border-white/[0.04] px-3 py-1.5 flex items-center justify-center gap-3">
          <span className="text-[11px] text-white/50">
            Page <span className="text-white font-semibold">{pageNumber}</span> of {numPages}
          </span>
          <span className="text-white/15">|</span>
          <span className="text-[11px] text-white/40">Scroll down to read · <kbd className="px-1 py-0.5 bg-white/5 rounded text-[10px]">S</kbd> switch mode</span>
        </div>
      )}

      {/* Info panel */}
      {showInfo && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="sticky z-30 bg-[#1a1410]/95 backdrop-blur-xl border-b border-white/[0.04] overflow-hidden"
          style={{ top: fullscreen ? 0 : scrollMode ? 104 : 56 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60">
            <span className="flex items-center gap-1.5"><FileText size={12} /> {numPages || catalog.page_count || '?'} pages</span>
            <span className="flex items-center gap-1.5"><Download size={12} /> {formatBytes(catalog.file_size)}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={12} /> Updated {formatDate(catalog.updated_at)}</span>
            {catalog.category && (
              <Link to={`/category/${catalog.category.slug}`} className="flex items-center gap-1.5 text-primary hover:underline">
                <BookOpen size={12} /> {catalog.category.name}
              </Link>
            )}
            {catalog.description && <p className="w-full text-xs text-white/40 mt-1 italic leading-relaxed">{catalog.description}</p>}
          </div>
        </motion.div>
      )}

      {/* PDF Viewer */}
      <div ref={viewerRef} className="flex-1 overflow-auto py-6 sm:py-10 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <Document
            file={catalog.pdf_url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center gap-4 py-24">
                <div className="relative">
                  <Loader2 size={36} className="animate-spin text-primary/80" />
                  <div className="absolute inset-0 animate-ping opacity-20"><Loader2 size={36} className="text-primary" /></div>
                </div>
                <p className="text-sm text-white/40 font-medium">Loading PDF...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center gap-4 py-24">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center"><AlertCircle size={28} className="text-red-400" /></div>
                <p className="text-sm text-white/50">Failed to load PDF</p>
                <a href={catalog.pdf_url} download className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-all shadow-lg shadow-primary/20">
                  <Download size={14} /> Download PDF to view
                </a>
              </div>
            }
          >
            {/* Scroll mode: render all pages */}
            {scrollMode && numPages ? (
              <div className="flex flex-col items-center gap-6 w-full">
                {Array.from({ length: numPages }, (_, i) => i + 1).map(pageIdx => (
                  <div
                    key={pageIdx}
                    ref={el => { if (el) pageRefs.current[pageIdx] = el; }}
                    data-page={pageIdx}
                    className="shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden bg-white ring-1 ring-white/5 w-full"
                  >
                    <Page
                      pageNumber={pageIdx}
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="[&_.react-pdf\_\_Page\_\_canvas]:mx-auto"
                    />
                  </div>
                ))}
                <p className="text-xs text-white/30 pb-6">
                  End of catalog · {numPages} pages · {catalog.title}
                </p>
              </div>
            ) : !scrollMode && (
              /* Single page mode */
              <div className="flex flex-col items-center">
                <motion.div
                  key={`${pageNumber}-${scale}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden bg-white ring-1 ring-white/5"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="[&_.react-pdf\_\_Page\_\_canvas]:mx-auto"
                  />
                </motion.div>

                <div className="flex items-center gap-4 text-[11px] text-white/30 pt-6 pb-8 flex-wrap justify-center">
                  <span>Page {pageNumber} of {numPages || catalog.page_count || '?'}</span>
                  <span className="hidden sm:inline">·</span>
                  <span className="hidden sm:inline">{catalog.title}</span>
                </div>
              </div>
            )}
          </Document>
        </div>
      </div>
    </div>
  );
}
