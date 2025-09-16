export async function deleteDepartment(id) {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch(`http://localhost:8080/departments/${id}/delete`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Помилка: ${errorData.message}`);
        } else {
            alert("Департамент успішно видалений!");
            setTimeout(() => {
                window.location.reload(); 
            }, 500);
        }
    } catch (error) {
        console.error("Помилка при видаленні департаменту:", error);
        alert("Сталася помилка при видаленні департаменту.");
    }
}


