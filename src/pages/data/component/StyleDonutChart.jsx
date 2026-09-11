import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function StyleDonutChart({ styleStats, isVisible }) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h2 className="display2 text-black">01 Favorite Style</h2>
        <span className="caption3 text-dark-gray">
          선호하는 스타일 태그 비율
        </span>
      </div>
      {styleStats.length === 0 ? (
        <div className="w-full h-40 flex items-center justify-center text-dark-gray body4 border border-[#EBEBEB] rounded-2xl">
          등록된 스타일 태그 데이터가 없습니다. 옷을 추가해 보세요!
        </div>
      ) : (
        <div className="p-8 flex flex-col md:flex-row items-center justify-around gap-6 shadow-2xs">
          <div className="relative w-96 h-96 flex items-center justify-center">
            {isVisible && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={styleStats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={160}
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    {styleStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2.5}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="display2">{styleStats[0]?.name}</span>
              <span className="body2 text-dark-gray">
                {styleStats[0]?.percent}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-55">
            {styleStats.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-8"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="body3 font-medium text-black">{s.name}</span>
                </span>
                <span className="body3 text-black">{s.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
