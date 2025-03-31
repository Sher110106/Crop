import { WeatherData } from "@/types/crop";

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://pro.openweathermap.org/data/2.5";

// Log API key status (without exposing the actual key)
console.log("OpenWeather API Key Status:", OPENWEATHER_API_KEY ? "Present" : "Missing");

if (!OPENWEATHER_API_KEY) {
  console.warn("OpenWeather API key is not set. Weather data will not be available.");
}

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  if (!OPENWEATHER_API_KEY) {
    console.error("OpenWeather API key is not configured");
    return null;
  }

  try {
    console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);
    const url = `${OPENWEATHER_BASE_URL}/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    console.log("Weather API URL:", url.replace(OPENWEATHER_API_KEY, "HIDDEN"));

    const response = await fetch(url);
    console.log("Weather API Response Status:", response.status);
    console.log("Weather API Response Status Text:", response.statusText);

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Invalid OpenWeather API key. Please check your configuration.");
        return null;
      }
      const errorText = await response.text();
      console.error("Weather API Error Response:", errorText);
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Weather API Response Data:", {
      list: data.list?.length,
      city: data.city?.name,
      timestamp: new Date().toISOString()
    });
    
    // Get the current weather (first item in the list)
    const currentWeather = data.list[0];
    
    const weatherData = {
      temperature: currentWeather.main.temp,
      humidity: currentWeather.main.humidity,
      windSpeed: currentWeather.wind.speed,
      precipitation: currentWeather.rain?.["1h"] || 0,
      description: currentWeather.weather[0].description,
      icon: currentWeather.weather[0].icon,
      timestamp: currentWeather.dt_txt
    };

    console.log("Processed Weather Data:", weatherData);
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return null;
  }
}

export async function fetchWeatherForecast(latitude: number, longitude: number, hours: number = 24) {
  if (!OPENWEATHER_API_KEY) {
    console.error("OpenWeather API key is not configured");
    return null;
  }

  try {
    console.log(`Fetching weather forecast for coordinates: ${latitude}, ${longitude}`);
    const url = `${OPENWEATHER_BASE_URL}/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&cnt=${hours}`;
    console.log("Weather Forecast API URL:", url.replace(OPENWEATHER_API_KEY, "HIDDEN"));

    const response = await fetch(url);
    console.log("Weather Forecast API Response Status:", response.status);
    console.log("Weather Forecast API Response Status Text:", response.statusText);

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Invalid OpenWeather API key. Please check your configuration.");
        return null;
      }
      const errorText = await response.text();
      console.error("Weather Forecast API Error Response:", errorText);
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Weather Forecast API Response Data:", {
      list: data.list?.length,
      city: data.city?.name,
      timestamp: new Date().toISOString()
    });

    const forecast = data.list.map((item: any) => ({
      temperature: item.main.temp,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      precipitation: item.rain?.["1h"] || 0,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      timestamp: item.dt_txt
    }));

    console.log("Processed Weather Forecast Data:", {
      count: forecast.length,
      firstTimestamp: forecast[0]?.timestamp,
      lastTimestamp: forecast[forecast.length - 1]?.timestamp
    });

    return forecast;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return null;
  }
} 