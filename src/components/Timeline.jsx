
const steps = [
  { key: "Beklemede", label: "Sipariş Alındı" },
  { key: "Onaylandı", label: "Sipariş Onaylandı" },
  { key: "Kargoya Verildi", label: "Kargoya Verildi" },
  { key: "Teslim Edildi", label: "Teslim Edildi" },
];

const Timeline = ({ currentStatus }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex justify-center max-w-xl my-6 md:mx-56">
      <div className="flex w-full justify-between items-start relative">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCompleted = index < currentIndex;
          const isLastStep = index === steps.length - 1;

          return (
            <div
              key={step.key}
              className={`flex flex-col items-center flex-1 ${!isLastStep ? 'relative' : ''}`}
            >
              {/* Çizgi (son nokta hariç) */}
              {!isLastStep && (
                <div
                  className={`absolute left-2/2 -ml-[1px] top-3 h-0.5 w-full -translate-x-1/2 transition-colors duration-300 ease-in-out ${
                    isCompleted ? "bg-orange-500" : "bg-gray-300"
                  }`}
                ></div>
              )}

              {/* Nokta */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors duration-300 ease-in-out ${
                  isActive ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-[10px] font-medium text-center max-w-[80px] transition-colors duration-300 ease-in-out ${
                  isActive ? "text-orange-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Timeline;


