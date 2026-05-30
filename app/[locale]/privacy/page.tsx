'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function PrivacyPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href={`/${locale}`}
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← {locale === 'en' ? 'Back to Home' : 'กลับไปที่หน้าแรก'}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว'}
          </h1>
          <p className="text-gray-600 text-lg">
            {locale === 'en'
              ? 'Last updated: May 2026'
              : 'อัปเดตครั้งล่าสุด: พฤษภาคม 2026'}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en'
                ? '1. Introduction'
                : '1. บทนำ'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'TC Collectibles ("we", "our", or "us") operates the tc-collectibles.vercel.app website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.'
                : 'TC Collectibles ("เรา", "ของเรา" หรือ "ของเรา") ดำเนินการเว็บไซต์ tc-collectibles.vercel.app หน้านี้แจ้งให้คุณทราบเกี่ยวกับนโยบายของเราเกี่ยวกับการเก็บรวบรวม การใช้งาน และการเปิดเผยข้อมูลส่วนตัวเมื่อคุณใช้บริการของเรา และทางเลือกที่คุณมีที่เกี่ยวข้องกับข้อมูลดังกล่าว'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en'
                ? '2. Definitions'
                : '2. คำนิยาม'}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>{locale === 'en' ? 'Service' : 'บริการ'}:</strong> {locale === 'en' ? 'The tc-collectibles.vercel.app website and all services provided by TC Collectibles' : 'เว็บไซต์ tc-collectibles.vercel.app และบริการทั้งหมดที่ TC Collectibles มอบให้'}
              </li>
              <li>
                <strong>{locale === 'en' ? 'Personal Data' : 'ข้อมูลส่วนตัว'}:</strong> {locale === 'en' ? 'Any information relating to an identified or identifiable natural person' : 'ข้อมูลใด ๆ ที่เกี่ยวข้องกับบุคคลธรรมชาติที่ระบุชื่อหรือสามารถระบุได้'}
              </li>
              <li>
                <strong>{locale === 'en' ? 'User' : 'ผู้ใช้'}:</strong> {locale === 'en' ? 'The individual using the Service' : 'บุคคลที่ใช้บริการ'}
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en'
                ? '3. Information Collection and Use'
                : '3. การเก็บรวบรวมและใช้ข้อมูล'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'We collect several different types of information for various purposes to provide and improve our Service:'
                : 'เรารวบรวมข้อมูลประเภทต่างๆ เพื่อวัตถุประสงค์ต่างๆ เพื่อให้บริการและปรับปรุงบริการของเรา:'}
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              {locale === 'en' ? 'a) Account Information' : 'ก) ข้อมูลบัญชี'}
            </h3>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'When you create an account, we collect your email address, name, and password.'
                : 'เมื่อคุณสร้างบัญชี เราเก็บรวบรวมที่อยู่อีเมล ชื่อ และรหัสผ่านของคุณ'}
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              {locale === 'en' ? 'b) Order Information' : 'ข) ข้อมูลคำสั่ง'}
            </h3>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'When you place an order, we collect shipping address, billing address, and payment information.'
                : 'เมื่อคุณสั่งซื้อ เราเก็บรวบรวมที่อยู่จัดส่ง ที่อยู่ใบเรียกเก็บเงิน และข้อมูลการชำระเงิน'}
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              {locale === 'en' ? 'c) Usage Data' : 'ค) ข้อมูลการใช้งาน'}
            </h3>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'We may collect information about how you access and use the Service, including IP address, browser type, and pages visited.'
                : 'เราอาจรวบรวมข้อมูลเกี่ยวกับวิธีที่คุณเข้าถึงและใช้บริการ รวมถึงที่อยู่ IP ประเภทเบราวเซอร์ และหน้าที่เข้าชม'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en'
                ? '4. Security of Data'
                : '4. ความปลอดภัยของข้อมูล'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.'
                : 'ความปลอดภัยของข้อมูลของคุณเป็นสิ่งสำคัญสำหรับเรา แต่โปรดจำไว้ว่าไม่มีวิธีการส่งข้อมูลทางอินเทอร์เน็ตหรือวิธีการจัดเก็บข้อมูลอิเล็กทรอนิกส์ที่ปลอดภัย 100% แม้ว่าเราพยายามใช้วิธีการที่ยอมรับได้ทางการค้าเพื่อปกป้องข้อมูลส่วนตัวของคุณ เราไม่สามารถรับประกันความปลอดภัยแบบสัมบูรณ์ได้'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en'
                ? '5. Changes to This Privacy Policy'
                : '5. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัวนี้'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.'
                : 'เราอาจปรับปรุงนโยบายความเป็นส่วนตัวของเราได้เรื่อย ๆ เราจะแจ้งให้คุณทราบถึงการเปลี่ยนแปลงใด ๆ โดยการโพสต์นโยบายความเป็นส่วนตัวใหม่บนหน้านี้และการอัปเดตวันที่ "อัปเดตครั้งล่าสุด" ที่ด้านบนของนโยบายความเป็นส่วนตัวนี้'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en'
                ? '6. Contact Us'
                : '6. ติดต่อเรา'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'If you have any questions about this Privacy Policy, please contact us at:'
                : 'หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ โปรดติดต่อเราที่:'}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> support@tccollectibles.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
