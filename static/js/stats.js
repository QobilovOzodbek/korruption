document.addEventListener('DOMContentLoaded', () => {
    loadStats();
});

function loadStats() {
    fetch('/stats-data/')
        .then(r => {
            if (!r.ok) throw new Error('Server javob bermadi');
            return r.json();
        })
        .then(data => {
            if (!data || !data.monthly) {
                console.warn('stats-data: no monthly data', data);
                return;
            }
            updateCards(data);
            drawChart(data.monthly);
            fillTable(data.monthly);
        })
        .catch(err => {
            console.error('Statistika yuklanmadi:', err);
        });
}

function updateCards(data) {
    const total = data.total || 0;
    const resolved = data.resolved || 0;
    const pending = data.pending || 0;
    const rejected = data.rejected || 0;
    const avg = data.avg_rating ?? 0;

    document.getElementById('total-clients-value').innerHTML = `<i class="fa-solid fa-inbox"></i> ${total}`;
    document.getElementById('growth-rate-value').innerHTML = `<i class="fa-solid fa-square-check"></i> ${(total ? ((resolved / total) * 100).toFixed(1) : 0)}%`;
    document.getElementById('projects-value').innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${pending}`;
    document.getElementById('average-rating-value').innerHTML = `<i class="fa-solid fa-star"></i> ${avg.toFixed(1)} <small style="color:#ffb703;">(Rad: ${rejected})</small>`;
}

let statsChart = null;
function drawChart(monthly) {
    const ctx = document.getElementById('monthlyActivityChart');
    if (!ctx) return;

    const labels = monthly.map(m => m.month);
    const pending = monthly.map(m => m.pending);
    const resolved = monthly.map(m => m.resolved);
    const rejected = monthly.map(m => m.rejected);

    if (statsChart) statsChart.destroy();

    statsChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Ko‘rib chiqilmoqda",
                    data: pending,
                    backgroundColor: 'rgba(255,193,7,0.8)',
                },
                {
                    label: "Hal qilingan",
                    data: resolved,
                    backgroundColor: 'rgba(40,167,69,0.8)',
                },
                {
                    label: "Rad etilgan",
                    data: rejected,
                    backgroundColor: 'rgba(220,53,69,0.8)',
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Oylik murojaatlar dinamikasi' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    title: { display: true, text: 'Holatlar soni' }
                }
            }
        }
    });
}

function fillTable(monthly) {
    const tbody = document.querySelector('#data-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    monthly.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${m.month}</td>
            <td>${m.total}</td>
            <td style="color:#ffc107"><b>${m.pending}</b></td>
            <td style="color:#28a745"><b>${m.resolved}</b></td>
            <td style="color:#dc3545"><b>${m.rejected}</b></td>
        `;
        tbody.appendChild(tr);
    });
}
