import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-200/40 text-base-content antialiased">
      {/* ส่วนหัวของเว็บพร้อมเมนู NavLink */}
      <Navbar />

      {/* เนื้อหาหลักของแต่ละหน้าจะถูกเรนเดอร์ผ่าน Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ส่วนท้ายของเว็บ */}
      <Footer />
    </div>
  );
};