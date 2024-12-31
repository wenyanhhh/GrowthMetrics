document.addEventListener('DOMContentLoaded', fetchAllApiData);

function fetchAllApiData() {
    const apiCalls = [
        { id: 'paid_user_count', callType: 'paid_user_count' },
        { id: 'paid_user_count_plan', callType: 'paid_user_count_plan' },
        { id: 'paid_user_rate', callType: 'paid_user_rate' },
        { id: 'daily_paid_user_growth_rate', callType: 'daily_paid_user_growth_rate' },
        { id: 'weekly_paid_user_growth_rate', callType: 'weekly_paid_user_growth_rate' },
        { id: 'monthly_paid_user_growth_rate', callType: 'monthly_paid_user_growth_rate' },
        { id: 'daily_new_users', callType: 'daily_new_users' },
        { id: 'weekly_new_users', callType: 'weekly_new_users' },
        { id: 'monthly_new_users', callType: 'monthly_new_users' },
        { id: 'retention_rate', callType: 'retention_rate' },
        { id: 'first_renewal_rate', callType: 'first_renewal_rate' },
        { id: 'subsequent_renewal_rate', callType: 'subsequent_renewal_rate' },
        { id: 'daily_activation_count', callType: 'daily_activation_count' },
        { id: 'weekly_activation_count', callType: 'weekly_activation_count' },
        { id: 'monthly_activation_count', callType: 'monthly_activation_count' },
        { id: 'first_session_user_engagement_tracking', callType: 'first_session_user_engagement_tracking' },
        { id: 'first_session_user_engagement_completion_rate', callType: 'first_session_user_engagement_completion_rate' },
        { id: 'first_session_drop_off_rate', callType: 'first_session_drop_off_rate' },
        { id: 'referral_rate', callType: 'referral_rate' },
        { id: 'daily_launch_click_growth_rate', callType: 'daily_launch_click_growth_rate' },
        { id: 'weekly_launch_click_growth_rate', callType: 'weekly_launch_click_growth_rate' },
        { id: 'monthly_launch_click_growth_rate', callType: 'monthly_launch_click_growth_rate' },
        { id: 'daily_launch_clicks_per_user', callType: 'daily_launch_clicks_per_user' },
        { id: 'weekly_launch_clicks_per_user', callType: 'weekly_launch_clicks_per_user' },
        { id: 'average_daily_launch_clicks_per_user', callType: 'average_daily_launch_clicks_per_user' },
        { id: 'average_weekly_launch_clicks_per_user', callType: 'average_weekly_launch_clicks_per_user' },
    ];

    apiCalls.forEach(api => {
        fetchApiData(api.id, api.callType);
    });
}

function fetchApiData(id, callType) {
    const url = 'https://instancecaller.azurewebsites.net/api/practicecall'


    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Call-Type': callType,
        }
    })
        .then(response => response.json())
        .then(data => {
            // 检查是否返回了字符串形式的 JSON
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            // 统一调用 displayData 方法
            displayData(id, data);
        })
        .catch(error => {
            console.error(`Error fetching data for ${callType}:`, error);
            document.getElementById(`${id}-result`).textContent = `Error: ${error.message}`;
        });
}


function displayData(id, data) {
    const resultElement = document.getElementById(id);

    if (data.columns && data.data) {
        // 如果是表格类型的数据，按照原逻辑显示表格
        if (data.chartType === 'table') {
            let tableHTML = '<table border="1" class="table table-striped"><thead><tr>';
            data.columns.forEach(column => {
                tableHTML += `<th>${column}</th>`;
            });
            tableHTML += '</tr></thead><tbody>';
            data.data.forEach(row => {
                tableHTML += '<tr>';
                row.forEach(cell => {
                    tableHTML += `<td>${cell}</td>`;
                });
                tableHTML += '</tr>';
            });
            tableHTML += '</tbody></table>';
            resultElement.innerHTML = tableHTML;
        } else if (data.chartType === 'line') {
            resultElement.innerHTML = `<canvas id="${id}-chart"></canvas>`;
            const ctx = document.getElementById(`${id}-chart`).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.data.map(row => row[0]), 
                    datasets: [{
                        label: id.replace(/_/g, ' '),
                        data: data.data.map(row => row[1]), 
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        pointRadius: 3,
                        tension: 0.4 
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: { display: true, text: 'Date' }
                        },
                        y: {
                            title: { display: true, text: 'Value' }
                        }
                    }
                }
            });
        }
    } else if (typeof data === 'number' || typeof data === 'string') {
        // 如果返回的是简单的数字或字符串，直接显示
        resultElement.textContent = data;
    } else {
        // 如果数据为空或格式不符合预期，显示提示
        resultElement.innerHTML = '<p>No data available</p>';
    }
}

