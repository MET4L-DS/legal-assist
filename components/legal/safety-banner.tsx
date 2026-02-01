import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Phone } from "lucide-react";

interface SafetyBannerProps {
	message: string;
}

export function SafetyBanner({ message }: SafetyBannerProps) {
	return (
		<div className="w-full animate-in slide-in-from-top duration-500 mb-6 font-inter">
			<Alert
				variant="destructive"
				className="border-l-4 border-l-red-600 bg-red-50 text-red-900 border-red-200 shadow-md py-6"
			>
				<AlertTriangle className="h-5 w-5 text-red-600" />
				<AlertTitle className="text-xl font-bold mb-2">
					Emergency Protocol Activated
				</AlertTitle>
				<AlertDescription className="text-base md:text-lg font-medium leading-relaxed">
					<p className="mb-4">{message}</p>
					<div className="flex gap-2">
						<a
							href="tel:112"
							className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md text-base font-bold hover:bg-red-700 transition-colors shadow-sm"
						>
							<Phone className="h-5 w-5" /> Dial 112
						</a>
					</div>
				</AlertDescription>
			</Alert>
		</div>
	);
}
