document.addEventListener('DOMContentLoaded', fetchAllApiData);

function fetchAllApiData() {
    const apiCalls = [
        { id: 'chart-dau30days', callType: 'fetchdau30days' },
        { id: 'chart-dnu30days', callType: 'fetchdnu30days' },
        { id: 'chart-churnedusers30days', callType: 'fetchchurnedusers30days' },
        { id: 'fetchd1retention30days', callType: 'fetchd1retention30days' },
        { id: 'fetchd7retention30days', callType: 'fetchd7retention30days' },
        { id: 'fetchd30retention30days', callType: 'fetchd30retention30days' },
        { id: 'getd1retention', callType: 'getd1retention' },
        { id: 'getd7retention', callType: 'getd7retention' },
        { id: 'getd30retention', callType: 'getd30retention' },
        { id: 'getdmidtermretention', callType: 'get_mid_term_user_activity_rate' },
        { id: 'get_weekly_active_users', callType: 'get_weekly_active_users' },
        { id: 'get_onboarding_completion', callType: 'get_onboarding_completion' },
        { id: 'get_lesson_completion', callType: 'get_lesson_completion' },
        { id: 'get_episode_unlocks', callType: 'get_episode_unlocks' },
        { id: 'get_episode_talk_completion', callType: 'get_episode_talk_completion' },
        { id: 'get_news_details_clicked', callType: 'get_news_details_clicked' },
        { id: 'get_profile_tab_click_rate', callType: 'get_profile_tab_click_rate' },
        { id: 'get_news_tab_click_rate', callType: 'get_news_tab_click_rate' },
        { id: 'get_conversations_per_user_week', callType: 'get_conversations_per_user_week' },
        { id: 'get_storylines_added_per_user_week', callType: 'get_storylines_added_per_user_week' },
        { id: 'get_yesterday_new_users', callType: 'get_yesterday_new_users' },
        { id: 'get_churned_users', callType: 'get_churned_users' },
        { id: 'fetchdailyactiveusers', callType: 'fetchdailyactiveusers' },
        { id: 'fetchmonthlyactiveusers', callType: 'fetchmonthlyactiveusers' },
        { id: 'fetchd1retentionsummary', callType: 'fetchd1retentionsummary' },
        { id: 'fetchd7retentionsummary', callType: 'fetchd7retentionsummary' },
        { id: 'fetchd30retentionsummary', callType: 'fetchd30retentionsummary' },
        { id: 'fetchaverageactivedays7', callType: 'fetchaverageactivedays7' },
        { id: 'fetchaverageactivedays30', callType: 'fetchaverageactivedays30' },
        { id: 'fetchdailynewusersmetrics', callType: 'fetchdailynewusersmetrics' },
        { id: 'fetchweeklynewusersdata', callType: 'fetchweeklynewusersdata' },
        { id: 'fetchweeklyactivationmetrics', callType: 'fetchweeklyactivationmetrics' },
        { id: 'getd1retention30days', callType: 'getd1retention30days' },
        { id: 'getd7retention30days', callType: 'getd7retention30days' },
        { id: 'getd30retention30days', callType: 'getd30retention30days' }
    ];

    apiCalls.forEach(api => {
        fetchApiData(api.id, api.callType);
    });
}

function fetchApiData(id, callType) {
    // const url = 'https://instancecaller.azurewebsites.net/api/practicecall';  // 你的后端 API URL
    const url = 'http://localhost:7071/api/PracticeCall'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Call-Type': callType  // 设置 Call-Type header
        }
    })
        .then(response => response.json())
        .then(data => {
            // 检查是否返回了字符串形式的 JSON
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if (['fetchdau30days', 'fetchdnu30days', 'fetchchurnedusers30days', 'fetchd1retention30days', 'fetchd7retention30days', 'fetchd30retention30days'].includes(callType)) {
                createChart(id, data, callType);
            } else {
                displayData(id, data);
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${callType}:`, error);
            document.getElementById(`${id}-result`).textContent = `Error: ${error.message}`;
        });
}


function displayData(id, data) {
    // console.log(`Data for ${id}:`, data);

    const columns = data.columns;
    const rows = data.data;

    if (!columns || !rows) {
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

    const resultElement = document.getElementById(`${id}-result`);
    resultElement.innerHTML = tableHTML;
}

function createChart(id, data, callType) {
    // console.log(data);

    if (!data || !data.data || data.data.length === 0 || !data.columns) {
        console.error(`No data or column information available for chart ${id}`);
        return;
    }

    let xAxisLabel, yAxisLabel, labels, dataset;

    // Logic for determining x and y axes based on callType
    if (['fetchdau30days', 'fetchdnu30days', 'fetchchurnedusers30days'].includes(callType)) {
        xAxisLabel = data.columns[0];
        yAxisLabel = data.columns[1];
        labels = data.data.map(row => row[0]);
        dataset = data.data.map(row => row[1]);
    } else if (['fetchd1retention30days', 'fetchd7retention30days', 'fetchd30retention30days'].includes(callType)) {
        xAxisLabel = data.columns[0];
        yAxisLabel = data.columns[3];
        labels = data.data.map(row => row[0]);
        dataset = data.data.map(row => row[3]);
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
                        label: function(tooltipItem) {
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

 