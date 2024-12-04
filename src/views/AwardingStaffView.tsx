import {Button} from "@/components/ui/button.tsx";

const AwardingStaffView = () => {
  return (
    <div className="mt-4 px-4 relative z-10">
      <div className="mt-5">
        <p className="font-medium text-lg">Объявление победителей</p>
        <p className="mb-4">
          Этот режим использует ТОЛЬКО ведущий на сцене. Несанкцианированное объявление пользователей записывается на
          сервере, поэтому кто решит поиграть пожалеет об этом
        </p>

        <div className="mt-4">
          <p className="text-neutral-400 text-sm">Олимпиада</p>
          <p>Искусственный интеллект</p>

          <div className="flex flex-col gap-2">
            <Button>Объявить места</Button>
            <Button>Объявить номинации</Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-neutral-400 text-sm">Олимпиада</p>
          <p>Программные решения</p>

          <div className="flex flex-col gap-2">
            <Button>Объявить места</Button>
            <Button>Объявить номинации</Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-neutral-400 text-sm">Олимпиада</p>
          <p>Системное администрирование</p>

          <div className="flex flex-col gap-2">
            <Button>Объявить места</Button>
            <Button>Объявить номинации</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AwardingStaffView