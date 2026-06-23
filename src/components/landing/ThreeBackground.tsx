"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Neo-Brutalist Colors
    const colors = [0xe8879f, 0x4db8a8, 0xf5d76e]; // Pink, Teal, Yellow
    const darkColor = 0x1a1a2e;

    const objects: THREE.Group[] = [];

    // Helper to create a Memphis-style 3D object
    const createMemphisObject = (
      geometry: THREE.BufferGeometry,
      colorHex: number,
      x: number,
      y: number,
      z: number,
      scale: number
    ) => {
      const group = new THREE.Group();

      // Flat color mesh
      const material = new THREE.MeshBasicMaterial({ color: colorHex });
      const mesh = new THREE.Mesh(geometry, material);

      // Dark thick outline
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: darkColor });
      const line = new THREE.LineSegments(edges, lineMaterial);

      group.add(mesh);
      group.add(line);

      group.position.set(x, y, z);
      group.scale.set(scale, scale, scale);

      group.userData = {
        rx: (Math.random() - 0.5) * 0.01,
        ry: (Math.random() - 0.5) * 0.01,
        yOffset: Math.random() * Math.PI * 2,
        yBase: y,
      };

      scene.add(group);
      objects.push(group);
    };

    // Primitives
    // Left side
    createMemphisObject(new THREE.BoxGeometry(2, 2, 2), colors[0], -18, 10, -5, 1.5);
    createMemphisObject(new THREE.ConeGeometry(1.5, 3, 4), colors[2], -15, -8, -6, 1.3);
    createMemphisObject(new THREE.TorusGeometry(1.2, 0.4, 8, 12), colors[1], -24, 2, -10, 1.2);
    createMemphisObject(new THREE.OctahedronGeometry(2), colors[1], -8, -14, -8, 1.2);

    // Right side
    createMemphisObject(new THREE.OctahedronGeometry(1.5), colors[0], 18, 12, -8, 1.1);
    createMemphisObject(new THREE.BoxGeometry(1.5, 1.5, 1.5), colors[2], 22, -10, -12, 1.5);
    createMemphisObject(new THREE.TorusGeometry(2, 0.6, 8, 12), colors[1], 15, -4, -15, 1.0);

    // Center / Deep bg
    createMemphisObject(new THREE.BoxGeometry(1, 1, 1), colors[2], -6, 14, -10, 2.0);
    createMemphisObject(new THREE.ConeGeometry(1, 2, 4), colors[0], 8, 18, -12, 1.5);
    createMemphisObject(new THREE.BoxGeometry(2.5, 2.5, 2.5), colors[0], 0, -18, -15, 1.0);
    createMemphisObject(new THREE.TorusGeometry(1, 0.3, 8, 12), colors[2], 5, 8, -20, 2.0);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    let animationFrameId: number;

    const animate = (time: number) => {
      const seconds = time * 0.001;

      objects.forEach((obj) => {
        obj.rotation.x += obj.userData.rx;
        obj.rotation.y += obj.userData.ry;
        obj.position.y =
          obj.userData.yBase + Math.sin(seconds + obj.userData.yOffset) * 0.5;
      });

      // Parallax camera movement
      camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose Geometries and Materials
      objects.forEach((group) => {
        group.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          } else if (child instanceof THREE.LineSegments) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} id="three-canvas-container" />;
}
