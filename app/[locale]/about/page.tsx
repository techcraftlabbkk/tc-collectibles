'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function AboutPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/${locale}`}
            className="text-blue-100 hover:text-white mb-4 inline-block"
          >
            ← {locale === 'en' ? 'Back to Home' : 'กลับไปที่หน้าแรก'}
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            {locale === 'en' ? 'About TC Collectibles' : 'เกี่ยวกับ TC Collectibles'}
          </h1>
          <p className="text-xl text-blue-100">
            {locale === 'en'
              ? 'Your trusted marketplace for graded Pokémon cards'
              : 'ตลาดที่เชื่อถือได้ของคุณสำหรับการ์ดโปเกมอนที่ได้รับการจัดอันดับ'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {locale === 'en' ? 'Our Mission' : 'พันธกิจของเรา'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {locale === 'en'
              ? 'TC Collectibles is dedicated to providing collectors with a secure, transparent, and trustworthy marketplace for graded Pokémon cards. We believe in the value of authentic collectibles and work tirelessly to ensure every transaction is legitimate and every card is genuine.'
              : 'TC Collectibles มีความมุ่งมั่นในการให้บริการผู้สะสมด้วยตลาดที่ปลอดภัย โปร่งใส และน่าเชื่อถือสำหรับการ์ดโปเกมอนที่ได้รับการจัดอันดับ เราเชื่อในคุณค่าของสินค้าเก่าแท้ และทำงานอย่างไม่เหนื่อยเพื่อให้แน่ใจว่าทุกธุรกรรมเป็นธรรมชาติและการ์ดแต่ละใบเป็นของแท้'}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {locale === 'en' ? 'Why Choose Us?' : 'ทำไมต้องเลือกเรา?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {locale === 'en' ? 'Verified Cards' : 'การ์ดที่ได้รับการตรวจสอบ'}
              </h3>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'Every card in our collection has been carefully inspected and graded by professional standards.'
                  : 'การ์ดทุกใบในคลังของเรามีการตรวจสอบอย่างรอบคอบและจัดอันดับตามมาตรฐานการเป็นมืออาชีพ'}
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {locale === 'en' ? 'Secure Transactions' : 'ธุรกรรมที่ปลอดภัย'}
              </h3>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'We use industry-leading security protocols to protect your personal and payment information.'
                  : 'เราใช้โปรโตคอลความปลอดภัยที่นำหน้าในอุตสาหกรรมเพื่อปกป้องข้อมูลส่วนตัวและการชำระเงินของคุณ'}
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {locale === 'en' ? 'Competitive Pricing' : 'ราคาที่มีความสามารถในการแข่งขัน'}
              </h3>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'Our prices are fair and competitive, reflecting the true market value of each card.'
                  : 'ราคาของเราเป็นธรรมชาติและมีความสามารถในการแข่งขัน สะท้อนถึงมูลค่าตลาดที่แท้จริงของการ์ดแต่ละใบ'}
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {locale === 'en' ? '24/7 Support' : 'การสนับสนุน 24/7'}
              </h3>
              <p className="text-gray-700">
                {locale === 'en'
                  ? 'Our dedicated support team is always available to answer your questions and resolve any issues.'
                  : 'ทีมการสนับสนุนที่เฉพาะเจาะจงของเรามีความพร้อมเสมอที่จะตอบคำถามและแก้ไขปัญหาของคุณ'}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {locale === 'en' ? 'Our Story' : 'เรื่องราวของเรา'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {locale === 'en'
              ? 'Founded in 2024, TC Collectibles emerged from a passion for Pokémon cards and a desire to create a trustworthy platform for collectors worldwide. What started as a small collection has grown into a thriving marketplace with thousands of verified cards and satisfied customers.'
              : 'ก่อตั้งขึ้นในปี 2024 TC Collectibles เกิดขึ้นจากความหลงใหลในการ์ดโปเกมอนและความปรารถนาที่จะสร้างแพลตฟอร์มที่น่าเชื่อถือสำหรับผู้สะสมทั่วโลก สิ่งที่เริ่มต้นเป็นคลังเล็ก ๆ ได้กลายเป็นตลาดที่เจริญรุ่งเรืองพร้อมการ์ดที่ได้รับการตรวจสอบหลายพันใบและลูกค้าที่พึงพอใจ'}
            </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {locale === 'en'
              ? 'We are committed to maintaining the highest standards of authenticity, customer service, and reliability. Whether you are a seasoned collector or just starting your Pokémon card journey, we are here to help you find the perfect cards for your collection.'
              : 'เรามีความมุ่งมั่นในการรักษามาตรฐานสูงสุดของความเป็นของแท้ บริการลูกค้า และความเชื่อถือได้ ไม่ว่าคุณจะเป็นผู้สะสมที่มีประสบการณ์หรือเพิ่งเริ่มการเดินทางของการ์ดโปเกมอน เราอยู่ที่นี่เพื่อช่วยคุณค้นหาการ์ดที่สมบูรณ์แบบสำหรับคลังของคุณ'}
            </p>
          </section>

        <section className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Contact Us' : 'ติดต่อเรา'}
          </h2>
          <p className="text-gray-700 mb-4">
            {locale === 'en'
              ? 'Have questions or feedback? We\'d love to hear from you!'
              : 'มีคำถามหรือข้อเสนอแนะหรือไม่? เรายินดีที่จะรับฟังจากคุณ!'}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> support@tccollectibles.com
          </p>
        </section>
      </div>
    </div>
  );
}
