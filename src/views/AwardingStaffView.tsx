import {Button} from "@/components/ui/button.tsx";

const AwardingStaffView = () => {
  return (
    <div className="mt-10 mb-5">
      <div className="mt-5">
        <p className="font-medium text-lg">Объявление победителей</p>
        <p className="mb-4">
          Этот режим использует ТОЛЬКО ведущий на сцене. Несанкцианированное объявление пользователей записывается на
          сервере, поэтому кто решит поиграть пожалеет об этом
        </p>

        <div className="mt-4">
          <p className="text-neutral-400 text-sm">Олимпиада</p>
          <p>Искусственный интеллект</p>

          <div>
            <Button>Объявить места</Button>
            <Button>Объявить номинации</Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-neutral-400 text-sm">Олимпиада</p>
          <p>Программные решения</p>

          <div>
            <Button>Объявить места</Button>
            <Button>Объявить номинации</Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-neutral-400 text-sm">Олимпиада</p>
          <p>Системное администрирование</p>

          <div>
            <Button>Объявить места</Button>
            <Button>Объявить номинации</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AwardingStaffView