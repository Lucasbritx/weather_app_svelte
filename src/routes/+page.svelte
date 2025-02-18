<script>
    import { onMount } from "svelte";
    let filter = "";
    let weatherData = {
        location: {
            name: "",
        },
        current: {
            temp_c: "",
            condition: {
                text: "",
                icon: "",
            },
            humidity: "",
            air_quality: {
                pm2_5: "",
            },
        },
    };
    let errorMessage = "";

    // TODO create env
    const apiKey = "";

    async function fetchWeather() {
        if (!filter) {
            errorMessage = "Por favor, insira uma localização válida.";
            return;
        }
        try {
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${filter}&aqi=yes`,
            );

            if (!response.ok) {
                throw new Error(
                    "Localização não encontrada. Por favor, tente novamente.",
                );
            }

            weatherData = await response.json();
            errorMessage = "";
        } catch (error) {
            errorMessage = error.message;
            weatherData = {};
        }
    }
</script>

<main class="p-4">
    <h1 class="text-xl mb-4">Previsão do Tempo</h1>

    <!-- Input e botão -->
    <div class="flex gap-2 mb-4">
        <input
            type="text"
            placeholder="Digite uma localização"
            bind:value={filter}
            class="border p-2 rounded w-full"
        />
        <button
            on:click={fetchWeather}
            class="bg-blue-500 text-white p-2 rounded"
        >
            Buscar
        </button>
    </div>

    {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {/if}

    {#if weatherData}
        <div class="border p-4 rounded bg-gray-100">
            <h2 class="text-lg font-bold mb-2">
                Localização: {weatherData.location.name}
            </h2>
            <p>Temperatura: {weatherData.current.temp_c}°C</p>
            <p>Condição: {weatherData.current.condition.text}</p>
            <p>Umidade: {weatherData.current.humidity}%</p>
            <p>
                Qualidade do Ar: {weatherData.current.air_quality.pm2_5} PM2.5
            </p>
            <img
                src={`http:${weatherData.current.condition.icon}`}
                alt={weatherData.current.condition.text}
            />
        </div>
    {/if}
</main>

<style>
    main {
        max-width: 600px;
        margin: 0 auto;
    }
</style>
