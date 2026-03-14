import { Series } from "@/lib/types";
import { SERIES_COLORS } from "@/lib/constants";

interface SeriesBadgeProps {
  readonly series: Series;
}

export const SeriesBadge = ({ series }: SeriesBadgeProps) => {
  const colors = SERIES_COLORS[series];
  return <span className={`carbon-chip ${colors.chipClass}`}>{series} Series</span>;
};
