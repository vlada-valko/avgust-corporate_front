export async function readEmployeeById(id) {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch('http://localhost:8080/employees/${id}', {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Помилка завантаження даних: ${response.statusText}`);
        }
        const data = await response.json();
        renderEmployeeCard(data.employee);
        return data; 
    } catch (error) {
        console.error(error);
        return [];
    }
}