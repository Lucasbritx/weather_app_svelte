<script>
    import { onMount } from "svelte";
    let filter = "";
    let weatherData = {
        location: {
            name: "",
            region: "",
            country: "",
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
    let latitude = 0;
    let longitude = 0;
    let error = null;
    let errorMessage = "";

    onMount(() => {
        getLocation();
    });

    function getLocation() {
        if (!navigator.geolocation) {
            error = "Geolocalização não é suportada no seu navegador.";
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                error = null;
                fetchWeather();
            },
            (err) => {
                error = `Erro ao obter localização: ${err.message}`;
            },
        );
    }

    async function fetchWeather() {
        try {
            const query = filter
                ? `q=${filter}`
                : `lat=${latitude}&lon=${longitude}`;
            const url = `/api/weather?${query}`;
            const response = await fetch(url);

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

<main class="p-4 bg-gradient-to-r from-blue-500 to-blue-900 h-screen">
    <h1 class="text-xl mb-4 text-white text-center">Previsão do Tempo</h1>

    <!-- Input e botão -->
    <div class="flex gap-2 mb-4">
        <input
            type="text"
            placeholder="Digite uma localização"
            bind:value={filter}
            class="border p-2 rounded w-full bg-white"
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
        <div class="border p-4 rounded bg-gray-100 flex items-center">
            <div>
                <h2 class="text-lg font-bold mb-2">
                    Localização: {weatherData.location?.name}
                    {weatherData.location?.region}
                    {weatherData.location?.country}
                </h2>
                <p>Temperatura: {weatherData?.current?.temp_c}°C</p>
                <p>Condição: {weatherData.current.condition?.text}</p>
                <p>Umidade: {weatherData.current?.humidity}%</p>
                <p>
                    Qualidade do Ar: {weatherData.current?.air_quality?.pm2_5} PM2.5
                </p>
            </div>
            <img
                src={`http:${weatherData.current.condition?.icon}`}
                alt={weatherData.current.condition?.text}
            />
        </div>
    {/if}
</main>

<style lang="postcss">
    @reference "tailwindcss/theme";
</style>
