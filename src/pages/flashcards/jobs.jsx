import { createPage } from "../../app";
import * as _ from "lodash";
import { FlashCardDeck } from "../../components/flashcards/FlashCardDeck";

export default function Page() {
  return (
    <div>
      <h1>Food</h1>
      <FlashCardDeck
        name=""
        list={[
          ["việc", "job, work"],
          ["nghề", "career, profession"],
          ["công việc", "work, task"],
          ["làm", "to work, to do"],
          ["học nghề", "to learn a trade"],
          ["xin việc", "to apply for a job"],
          ["phỏng vấn", "interview"],
          ["đi làm", "to go to work"],
          ["bỏ việc", "to quit a job"],
          ["thất nghiệp", "unemployed"],
          ["công ty", "company"],
          ["sếp", "boss (casual, Southern dialect)"],
          ["ông chủ", "boss, employer (male)"],
          ["bà chủ", "boss, employer (female)"],
          ["đồng nghiệp", "colleague"],
          ["nhân viên", "employee"],
          ["quản lý", "manager"],
          ["giám đốc", "director, CEO"],
          ["trưởng phòng", "department head"],
          ["kỹ sư", "engineer"],
          ["bác sĩ", "doctor"],
          ["y tá", "nurse"],
          ["giáo viên", "teacher"],
          ["thầy giáo", "male teacher"],
          ["cô giáo", "female teacher"],
          ["luật sư", "lawyer"],
          ["kế toán", "accountant"],
          ["nhà báo", "journalist"],
          ["nông dân", "farmer"],
          ["thợ", "worker, artisan"],
          ["thợ xây", "construction worker"],
          ["thợ điện", "electrician"],
          ["thợ sửa xe", "mechanic"],
          ["thợ hớt tóc", "barber (Southern dialect of 'thợ cắt tóc')"],
          ["ca sĩ", "singer"],
          ["diễn viên", "actor, actress"],
          ["nhà thiết kế", "designer"],
          ["lập trình viên", "programmer, developer"],
          ["bảo vệ", "security guard"],
          ["nhân viên bán hàng", "salesperson"],
          ["phục vụ", "waiter, waitress"],
          ["hướng dẫn viên", "tour guide"],
          ["phi công", "pilot"],
          ["tiếp viên hàng không", "flight attendant"],
          ["tài xế", "driver (Southern dialect of 'lái xe')"],
          ["doanh nhân", "businessperson"],
          ["chủ quán", "shop/restaurant owner"],
          ["freelancer", "freelancer (commonly used in Vietnamese)"],
          ["lương", "salary"],
          ["tăng lương", "raise, salary increase"],
          ["làm thêm", "overtime, extra work"],
          ["ca làm", "work shift"],
          ["chuyên môn", "expertise, specialty"],
          ["kinh nghiệm", "experience (work-related)"],
        ]}
      />
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
