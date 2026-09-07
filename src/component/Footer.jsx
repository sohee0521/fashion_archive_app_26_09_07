import LogoImg from "../img/Logo2.png";

export default function Footer() {
  return (
    <footer className="w-full lg:px-[180px] sm:px-[100px] px-[50px] py-[40px] bg-black flex items-end justify-between mt-auto">
      <div>
        <p className="caption4 flex gap-[10px] text-white/50 ">
          PROJECT{" "}
          <span className="text-white/80">
            {" "}
            A personal fashion archive app.
          </span>
        </p>
        <p className="caption4  text-white/40 ">
          © 2026 FITLOG. All rights reserved.
        </p>
      </div>

      <div className=" display3 h-[100px]">
        <img src={LogoImg} alt="Fitlog Logo" className="w-full h-full" />
      </div>
    </footer>
  );
}
