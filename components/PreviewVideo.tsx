import React, { useEffect, useRef, useState } from 'react';

interface PreviewVideoProps {
  src: string;
  poster: string;
  label: string;
  suspended?: boolean;
}

export function PreviewVideo({ src, poster, label, suspended = false }: PreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleRef = useRef<() => void>(() => {});
  const userPaused = useRef(false);
  const manualPlay = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let visible = false;
    let disposed = false;
    let playPending = false;
    const wantsPlayback = () => !disposed && visible && !document.hidden && !suspended && !userPaused.current
      && (manualPlay.current || (!reducedMotion.matches && !connection?.saveData));
    const updatePlaying = () => setPlaying(!video.paused);
    const sync = () => {
      if (!wantsPlayback()) { video.pause(); return; }
      if (!video.hasAttribute('src')) video.src = src;
      if (playPending || !video.paused) return;
      playPending = true;
      let interrupted = false;
      video.play().then(() => {
        if (!disposed && !wantsPlayback()) video.pause();
      }).catch((error: unknown) => {
        interrupted = error instanceof DOMException && error.name === 'AbortError';
        // Browser autoplay policy can still require the visible Play button.
        if (!disposed) setPlaying(false);
      }).finally(() => {
        playPending = false;
        // A pause may abort loading after the preview has already become visible again.
        if (interrupted && wantsPlayback()) sync();
      });
    };
    const onError = () => { setFailed(true); setPlaying(false); };
    toggleRef.current = () => {
      userPaused.current = !video.paused;
      manualPlay.current = video.paused;
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      sync();
    }, { threshold: [0, 0.15] });
    observer.observe(video);
    video.addEventListener('play', updatePlaying);
    video.addEventListener('pause', updatePlaying);
    video.addEventListener('error', onError);
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    connection?.addEventListener('change', sync);
    updatePlaying();
    return () => {
      disposed = true;
      observer.disconnect();
      video.removeEventListener('play', updatePlaying);
      video.removeEventListener('pause', updatePlaying);
      video.removeEventListener('error', onError);
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
      connection?.removeEventListener('change', sync);
      video.pause();
    };
  }, [src, suspended]);

  return (
    <div className="preview-video">
      <video ref={videoRef} className="featured-card__asset" poster={poster} muted loop playsInline preload="none" aria-label={label} />
      {failed ? <span className="preview-video__status" role="status">Preview unavailable</span> : (
        <button type="button" className="preview-video__toggle" onClick={() => toggleRef.current()}
          aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}>
          {playing ? 'Pause preview' : 'Play preview'}
        </button>
      )}
    </div>
  );
}
