import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Theme } from "./useTheme";

gsap.registerPlugin(ScrollTrigger);

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

export function useScrollEffects(theme: Theme, routeKey = "") {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Pinned background titles — content scrolls over
      if (!isMobile) {
      document.querySelectorAll<HTMLElement>(".pinned-section").forEach((section) => {
        const title = section.querySelector<HTMLElement>(".pinned-section__title");
        const content = section.querySelector<HTMLElement>(".pinned-section__content");
        if (!title || !content) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 12%",
          end: () => `+=${Math.max(content.offsetHeight, 400)}`,
          pin: title,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });
      }

      const philosophyMuted = cssVar("--philosophy-muted", "rgba(15, 23, 42, 0.28)");
      const philosophyBright = cssVar("--philosophy-bright", "rgba(15, 23, 42, 0.92)");

      // Philosophy text fills on scroll
      document.querySelectorAll<HTMLElement>(".philosophy__text").forEach((el) => {
        gsap.fromTo(
          el,
          { color: philosophyMuted },
          {
            color: philosophyBright,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "center center",
              scrub: true,
            },
          },
        );
        const accent = el.querySelector<HTMLElement>(".philosophy__accent");
        if (accent) {
          gsap.fromTo(
            accent,
            { opacity: 0.3 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 75%",
                end: "center center",
                scrub: true,
              },
            },
          );
        }
      });

      // Service cards swipe up on scroll
      gsap.utils.toArray<HTMLElement>(".card--rise").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      const homeVideoFlow = document.querySelector<HTMLElement>(
        ".home-video-about-flow",
      );
      const homeVideoCard = document.querySelector<HTMLElement>(
        ".home-video-card",
      );
      const homeVideoDock = document.querySelector<HTMLElement>(
        ".home-about__video-dock",
      );

      if (!isMobile && homeVideoFlow && homeVideoCard && homeVideoDock) {
        gsap.fromTo(
          homeVideoCard,
          {
            x: 0,
            y: 0,
            scale: 1,
            borderRadius: "0px",
            transformOrigin: "top left",
          },
          {
            x: () => {
              const card = homeVideoCard.getBoundingClientRect();
              const dock = homeVideoDock.getBoundingClientRect();
              return dock.left - card.left;
            },
            y: () => {
              const card = homeVideoCard.getBoundingClientRect();
              return window.innerHeight * 0.32 - card.top;
            },
            scale: () => {
              const card = homeVideoCard.getBoundingClientRect();
              const dock = homeVideoDock.getBoundingClientRect();
              return Math.max(0.28, Math.min(0.52, dock.width / card.width));
            },
            borderRadius: "28px",
            ease: "none",
            scrollTrigger: {
              trigger: homeVideoFlow,
              endTrigger: homeVideoDock,
              start: "top 72px",
              end: "top 32%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      // Horizontal pinned proof blocks
      const track = document.querySelector<HTMLElement>(".proof-pin");
      const trackInner = document.querySelector<HTMLElement>(".proof-pin__track");
      if (!isMobile && track && trackInner && trackInner.scrollWidth > track.offsetWidth) {
        const scrollDistance = trackInner.scrollWidth - track.offsetWidth;
        gsap.to(trackInner, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top 20%",
            end: () => `+=${scrollDistance + 200}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Hero title motion blur pulse
      gsap.utils.toArray<HTMLElement>(".hero-word-blur").forEach((word) => {
        gsap.to(word, {
          x: 12,
          duration: 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [theme, routeKey]);
}
