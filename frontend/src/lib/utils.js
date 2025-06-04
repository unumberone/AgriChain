import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getWeatherIcon(description) {
    switch (description?.toLowerCase()) {
      case 'clear sky':
      case 'mostly clear':
        return <Sun className="h-6 w-6" />;
      case 'partly cloudy':
        return <CloudSun className="h-6 w-6" />;
      case 'overcast':
        return <Cloudy className="h-6 w-6" />;
      case 'foggy':
      case 'dense fog':
        return <CloudFog className="h-6 w-6" />;
      case 'light drizzle':
      case 'moderate drizzle':
      case 'heavy drizzle':
        return <CloudDrizzle className="h-6 w-6" />;
      case 'light rain':
      case 'moderate rain':
      case 'heavy rain':
      case 'light rain showers':
      case 'moderate rain showers':
      case 'heavy rain showers':
        return <CloudRain className="h-6 w-6" />;
      case 'light snowfall':
      case 'moderate snowfall':
      case 'heavy snowfall':
        return <CloudSnow className="h-6 w-6" />;
      default:
        return <Cloud className="h-6 w-6" />;
    }
  };
