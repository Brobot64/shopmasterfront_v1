// components/CardSection.tsx
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

const cards = [
	{
		title: "Analytics",
		description: "Track key metrics in real-time and boost performance.",
		image: "/assets/analytics.svg",
        price: 720,
        fall: true,
	},
	{
		title: "Automation",
		description: "Let workflows run on autopilot and save dev hours.",
		image: "/assets/automation.svg",
        price: 1200,
        fall: false,
	},
	{
		title: "Collaboration",
		description: "Work together with your team using seamless tools.",
		image: "/assets/collab.svg",
        price: 1800,
        fall: false,

	},
];

export default function CardSection() {
	return (
		<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{cards.map((card, idx) => (
				<div
					key={idx}
					className={`shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition duration-300 card-display overflow-hidden relative ${idx === 2 ? "gold" : ""} ${idx === 1 ? "red" : ""}`}
				>
					{/* <div className="w-20 h-20 mx-auto mb-4 relative">
						<Image src={card.image} alt={card.title} layout="fill" />
					</div> */}
					<div className="main-content bg-transparent z-10">
						<div className="top flex justify-between items-center">
							<h3 className="text-xl font-semibold mb-2">{card.title}</h3>
							<Select>
								<SelectTrigger className="w-[70px]  text-[12px] font-semibold px-[5px] py-[8px] rounded-4 gap-0">
									<SelectValue placeholder="7 days" />
								</SelectTrigger>
								<SelectContent className="text-[12px] font-semibold bg-background">
									<SelectGroup>
										<SelectLabel>Range</SelectLabel>
										<SelectItem value="weekly">Weekly</SelectItem>
										<SelectItem value="monthly">Monthly</SelectItem>
										<SelectItem value="yearly">Yearly</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<h1 className="text-5xl font-bold flex flex-row items-end leading-[2.25rem] justify-center gap-[40px] font-support my-5 mt-6">
                            <span className="text-[1.2rem] leading-[1.5rem]">$</span> {card.price}
                        </h1>
						<div className="bottom flex items-center justify-end">
                            <div className={`text-[14px] ${card.fall ? "bg-lightBgRed" : "bg-lightBgGreen"} border-[1px] rounded-full h-fit w-fit p-1 flex gap-1.5 items-center ${card.fall ? "text-darkRedTxt" : "text-darkGreenTxt"} ${card.fall ? "border-darkRedTxt" : "border-darkGreenTxt"}`}>
                                {card.fall ? <TrendingDown size={14}/> : <TrendingUp size={14}/>}
                                <span className="leading-[15px]">12%</span>
                            </div>
                        </div>
					</div>

					<span className="mural"></span>
				</div>
			))}
		</div>
	);
}
