'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function TermsPage() {
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
            {locale === 'en' ? 'Terms & Conditions' : 'ข้อกำหนดและเงื่อนไข'}
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
              {locale === 'en' ? '1. Acceptance of Terms' : '1. การยอมรับเงื่อนไข'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
                : 'โดยการเข้าใช้งานเว็บไซต์นี้ คุณยอมรับและตกลงผูกพันตามข้อกำหนดและข้อบังคับของข้อตกลงนี้ หากคุณไม่同意ให้ปฏิบัติตามข้อกำหนดข้างต้น โปรดอย่าใช้บริการนี้'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? '2. Use License' : '2. ใบอนุญาตการใช้งาน'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'Permission is granted to temporarily download one copy of the materials (information or software) on TC Collectibles for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:'
                : 'ได้รับอนุญาตให้ดาวน์โหลดสำเนาชั่วคราวของเนื้อหา (ข้อมูลหรือซอฟต์แวร์) บน TC Collectibles เพื่อการดูส่วนตัวที่ไม่ใช่เชิงพาณิชย์เท่านั้น นี่คือการให้ใบอนุญาต ไม่ใช่การโอนกรรมสิทธิ์ และภายใต้ใบอนุญาตนี้ คุณอาจจะไม่:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>{locale === 'en' ? 'Modify or copy the materials' : 'แก้ไขหรือคัดลอกเนื้อหา'}</li>
              <li>{locale === 'en' ? 'Use the materials for any commercial purpose' : 'ใช้เนื้อหาเพื่อวัตถุประสงค์ทางการค้า'}</li>
              <li>{locale === 'en' ? 'Attempt to decompile or reverse engineer any software' : 'พยายามถอดรหัสหรือระบบวิศวกรรมซ้ำของซอฟต์แวร์'}</li>
              <li>{locale === 'en' ? 'Remove any copyright or proprietary notations' : 'ลบหมายเหตุเกี่ยวกับลิขสิทธิ์หรือทรัพย์สินใด ๆ'}</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? '3. Disclaimer' : '3. ปฏิเสธความรับผิด'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'The materials on TC Collectibles are provided on an "as is" basis. TC Collectibles makes no warranties, expressed or implied, and hereby disclaims and negates any other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
                : 'เนื้อหาบน TC Collectibles ได้รับจากเว็บไซต์ดังกล่าวเท่านั้น TC Collectibles ไม่ให้การรับประกันใด ๆ ที่แสดงออกมาหรือโดยปริยาย และโดยนี้ปฏิเสธและปฏิเสธการรับประกันอื่น ๆ รวมถึงแต่ไม่จำกัด เฉพาะการรับประกันโดยปริยายหรือเงื่อนไขของความเหมาะสมทางการค้า การเหมาะสมสำหรับวัตถุประสงค์เฉพาะ หรือการไม่ละเมิดทรัพย์สินทางปัญญาหรือการละเมิดสิทธิอื่น ๆ'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? '4. Limitations of Liability' : '4. ข้อจำกัดของความรับผิด'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'In no event shall TC Collectibles or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TC Collectibles, even if TC Collectibles or an authorized representative has been notified orally or in writing of the possibility of such damage.'
                : 'ไม่ว่าในกรณีใด TC Collectibles หรือผู้ผลิตของ TC Collectibles จะไม่รับผิดชอบต่อความเสียหาย (รวมถึงแต่ไม่จำกัด ความเสียหายจากการสูญเสียข้อมูลหรือกำไร หรือเนื่องจากการหยุดชะงักของธุรกิจ) ที่เกิดจากการใช้หรือการไม่สามารถใช้เนื้อหาบน TC Collectibles แม้ว่า TC Collectibles หรือตัวแทนที่ได้รับอนุญาตจะได้รับแจ้งวาจาหรือเป็นลายลักษณ์อักษรถึงความเป็นไปได้ของความเสียหายดังกล่าว'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? '5. Accuracy of Materials' : '5. ความถูกต้องของเนื้อหา'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'The materials appearing on TC Collectibles could include technical, typographical, or photographic errors. TC Collectibles does not warrant that any of the materials on TC Collectibles are accurate, complete, or current. TC Collectibles may make changes to the materials contained on TC Collectibles at any time without notice.'
                : 'เนื้อหาที่ปรากฏบน TC Collectibles อาจมีข้อผิดพลาดทางเทคนิค การพิมพ์ หรือการถ่ายภาพ TC Collectibles ไม่รับประกันว่าเนื้อหาใด ๆ บน TC Collectibles มีความถูกต้อง สมบูรณ์ หรือปัจจุบัน TC Collectibles อาจเปลี่ยนแปลงเนื้อหาบน TC Collectibles ได้ตลอดเวลาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? '6. Links' : '6. ลิงก์'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'TC Collectibles has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TC Collectibles of the site. Use of any such linked website is at the user\'s own risk.'
                : 'TC Collectibles ยังไม่ได้ตรวจสอบเว็บไซต์ทั้งหมดที่เชื่อมโยงกับเว็บไซต์ของ TC Collectibles และไม่รับผิดชอบต่อเนื้อหาของเว็บไซต์ที่เชื่อมโยงดังกล่าว การรวมลิงก์ใด ๆ ไม่ได้หมายความว่า TC Collectibles สนับสนุนเว็บไซต์ดังกล่าว การใช้งานเว็บไซต์ที่เชื่อมโยงดังกล่าวเป็นความเสี่ยงของผู้ใช้เอง'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? '7. Modifications' : '7. การแก้ไข'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'TC Collectibles may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.'
                : 'TC Collectibles อาจแก้ไขข้อกำหนดการให้บริการสำหรับเว็บไซต์ของ TC Collectibles ได้ตลอดเวลาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า โดยการใช้เว็บไซต์นี้ คุณตกลงที่จะผูกพันตามเวอร์ชันปัจจุบันของข้อกำหนดการให้บริการเหล่านี้'}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? '8. Contact' : '8. ติดต่อเรา'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'en'
                ? 'If you have any questions about these Terms & Conditions, please contact us at support@tccollectibles.com'
                : 'หากคุณมีคำถามเกี่ยวกับข้อกำหนดและเงื่อนไขเหล่านี้ โปรดติดต่อเราที่ support@tccollectibles.com'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
