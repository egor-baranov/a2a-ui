import {Badge} from "@/components/ui/badge";

interface PresetsProps { onSelect: (preset: string) => void; }

export function Presets({ onSelect }: PresetsProps) {
	const presets = ["App Logo", "Search Icon", "SVG Image", "Improve Icon"];
	return (
		<div className="flex flex-wrap justify-center gap-3">
			{presets.map((p, i) => (
				<Badge key={i} variant="outline" onClick={() => onSelect(p)}>
					{p}
				</Badge>
			))}
		</div>
	);
}
