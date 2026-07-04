import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  isBackground?: boolean;
}

export default function ThreeCanvas({ isBackground = false }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // The particle backdrop is decoration; on phones and for reduced-motion
    // users its constant GPU work (especially under Safari's backdrop-filter)
    // costs far more than it adds. Skip it entirely there.
    if (
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (isBackground ? window.innerHeight : 500);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.z = isBackground ? 10 : 5;
    camera.layers.enable(0); // Using default layer since model is gone
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Group to hold all interactive meshes
    const group = new THREE.Group();
    scene.add(group);

    // Particle streams ambiently scattered
    const particlesCount = isBackground ? 800 : 350;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const randomSpeeds = new Float32Array(particlesCount);

    const sizeX = isBackground ? 40 : 18;
    const sizeY = isBackground ? 25 : 12;
    const sizeZ = isBackground ? 20 : 10;

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * sizeX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * sizeY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * sizeZ;
      randomSpeeds[i] = 0.05 + Math.random() * 0.15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 14; canvas.height = 14;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(2, 169, 88, 1)');
      gradient.addColorStop(1, 'rgba(2, 169, 88, 0)');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x02A958,
      size: isBackground ? 0.35 : 0.2,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: isBackground ? 0.4 : 1.0,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particleSystem);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x02A958, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Interaction logic
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let currentScrollFraction = 0, targetScrollFraction = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) targetScrollFraction = window.scrollY / maxScroll;
    };
    if (isBackground) window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation Loop (30fps is plenty for ambient particles; halves GPU load)
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const animate = (now = 0) => {
      animationFrameId = requestAnimationFrame(animate);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      const elapsedTime = clock.getElapsedTime();

      // Particle animation
      const positionsArray = particleSystem.geometry.attributes.position.array as Float32Array;
      const maxY = (isBackground ? 25 : 12) / 2;
      for (let i = 0; i < particlesCount; i++) {
        positionsArray[i * 3 + 1] += randomSpeeds[i] * 0.05;
        if (positionsArray[i * 3 + 1] > maxY) {
          positionsArray[i * 3 + 1] = -maxY;
          positionsArray[i * 3] = (Math.random() - 0.5) * (isBackground ? 40 : 18);
          positionsArray[i * 3 + 2] = (Math.random() - 0.5) * (isBackground ? 20 : 10);
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      group.rotation.y = targetX * (isBackground ? 0.3 : 0.8) + (isBackground ? currentScrollFraction * Math.PI * 1.5 : 0);
      group.rotation.x = -targetY * (isBackground ? 0.3 : 0.8) + (isBackground ? Math.sin(currentScrollFraction * Math.PI) * 0.5 : 0);
      
      renderer.render(scene, camera);
    };

    animate();

    // Stop rendering entirely while the tab is hidden.
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        const finalHeight = newHeight || (isBackground ? window.innerHeight : 500);
        renderer.setSize(newWidth, finalHeight);
        camera.aspect = newWidth / finalHeight;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (isBackground) window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [isBackground]);

  if (isBackground) {
    return (
      <div 
        ref={containerRef} 
        className="fixed inset-0 w-full h-full min-h-screen pointer-events-none z-[9999]" 
        id="three-3d-background-visualizer" 
      />
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[350px] md:h-[480px] relative overflow-hidden flex items-center justify-center" id="three-3d-visualizer">
      <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-[#fafafa] dark:to-slate-950 pointer-events-none" />
      <div className="absolute text-center select-none pointer-events-none z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-primary/70 block mb-1">GhestIt Engine v2.0</span>
        <span className="text-[10px] text-slate-400 font-sans block">شبیه‌ساز سه‌بعدی زنجیره پرداخت اقساط</span>
      </div>
    </div>
  ); 
}
