document.addEventListener('DOMContentLoaded', fetchAllApiData);

function fetchAllApiData() {
    const apiCalls = [
        { id: 'paid_user_count', callType: 'paid_user_count' },
        { id: 'paid_user_count_plan', callType: 'paid_user_count_plan' },
        { id: 'paid_user_rate', callType: 'paid_user_rate' },
        { id: 'daily_paid_user_count', callType: 'daily_paid_user_count' },
        { id: 'daily_paid_user_growth_rate', callType: 'daily_paid_user_growth_rate' },
        { id: 'weekly_paid_user_growth_rate', callType: 'weekly_paid_user_growth_rate' },
        { id: 'monthly_paid_user_growth_rate', callType: 'monthly_paid_user_growth_rate' },
        { id: 'total_users_count', callType: 'total_users_count' },
        { id: 'daily_new_users', callType: 'daily_new_users' },
        { id: 'weekly_new_users', callType: 'weekly_new_users' },
        { id: 'monthly_new_users', callType: 'monthly_new_users' },
        { id: 'retention_rate', callType: 'retention_rate' },
        { id: 'first_renewal_rate', callType: 'first_renewal_rate' },
        { id: 'subsequent_renewal_rate', callType: 'subsequent_renewal_rate' },
        { id: 'daily_login_count', callType: 'daily_login_count' },
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
    const url = 'https://instancecaller.azurewebsites.net/api/practicecall';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Call-Type': callType // 设置 Call-Type header
        },
    })
        .then(response => response.json())
        .then(data => {
            // 检查是否返回了字符串形式的 JSON
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if (['daily_paid_user_count', 'daily_paid_user_growth_rate', 'weekly_paid_user_growth_rate', 'monthly_paid_user_growth_rate', 'daily_new_users', 'weekly_new_users', 'monthly_new_users', 'daily_login_count', 'daily_activation_count', 'weekly_activation_count', 'monthly_activation_count', 'daily_launch_click_growth_rate', 'weekly_launch_click_growth_rate', 'monthly_launch_click_growth_rate', 'monthly_launch_click_growth_rate', 'average_daily_launch_clicks_per_user', 'average_weekly_launch_clicks_per_user'].includes(callType)) {
                createChart(id, data, callType);
            } else {
                displayData(id, data);
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${callType}:`, error);
            const resultElement = document.getElementById(id);
            if (resultElement) {
                resultElement.textContent = `Error: ${error.message}`;
            }
        });
}

function displayData(id, data) {
    const resultElement = document.getElementById(id); // 修正为直接使用 id
    if (!resultElement) {
        console.error(`Element with ID ${id} not found.`);
        return;
    }

    const columns = data?.columns || [];
    const rows = data?.data || [];

    if (!columns.length || !rows.length) {
        resultElement.innerHTML = `<p>No data available</p>`;
        return;
    }

    let tableHTML = '<table border="1"><thead><tr>';
    columns.forEach(column => {
        tableHTML += `<th>${column}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    rows.forEach(row => {
        tableHTML += '<tr>';
        row.forEach(cell => {
            tableHTML += `<td>${cell}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    resultElement.innerHTML = tableHTML;
}


function createChart(id, data, callType) {
    if (!data || !data.data || data.data.length === 0 || !data.columns) {
        console.error(`No data or column information available for chart ${id}`);
        return;
    }

    let xAxisLabel, yAxisLabel, labels, dataset;

    if (['daily_paid_user_count', 'daily_paid_user_growth_rate', 'weekly_paid_user_growth_rate', 'monthly_paid_user_growth_rate', 'daily_new_users', 'weekly_new_users', 'monthly_new_users', 'daily_login_count', 'daily_activation_count', 'weekly_activation_count', 'monthly_activation_count', 'daily_launch_click_growth_rate', 'weekly_launch_click_growth_rate', 'monthly_launch_click_growth_rate', 'monthly_launch_click_growth_rate', 'average_daily_launch_clicks_per_user', 'average_weekly_launch_clicks_per_user'].includes(callType)) {
        xAxisLabel = data.columns[0];
        yAxisLabel = data.columns[1];
        labels = data.data.map(row => row[0]);
        dataset = data.data.map(row => row[1]);
    } else {
        console.error(`No matching logic for callType: ${callType}`);
        return;
    }

    const ctx = document.getElementById(id).getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: yAxisLabel,
                data: dataset,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 5,
                pointHoverRadius: 7,
                showLine: true,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: xAxisLabel,
                        font: {
                            size: 16
                        }
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yAxisLabel,
                        font: {
                            size: 16
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${yAxisLabel}: ${tooltipItem.raw}`;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}
