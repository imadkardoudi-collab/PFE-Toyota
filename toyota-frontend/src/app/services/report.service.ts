import { Injectable } from '@angular/core';
import { Intervention } from '../models/intervention';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  generateInterventionReport(intervention: Intervention): void {
    if (!intervention) {
      console.error('No intervention provided');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
      alert('Impossible d\'ouvrir la fenêtre d\'impression');
      return;
    }

    // Format date
    const dateIntervention = new Date(intervention.dateIntervention).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Build HTML content for report
    const reportHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport d'Intervention</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            background: white;
            color: #333;
            line-height: 1.6;
          }
          
          .report-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
            background: white;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #667eea;
            font-size: 28px;
          }
          
          .header-info {
            text-align: right;
          }
          
          .header-info p {
            color: #666;
            margin: 5px 0;
          }
          
          .section {
            margin-bottom: 30px;
          }
          
          .section h2 {
            color: #764ba2;
            font-size: 18px;
            border-left: 4px solid #764ba2;
            padding-left: 12px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .section-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
          }
          
          .info-row:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 600;
            color: #555;
            min-width: 200px;
          }
          
          .info-value {
            color: #333;
            flex: 1;
          }
          
          .status-badge {
            display: inline-block;
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
          }
          
          .status-en-attente {
            background: #fff3cd;
            color: #856404;
          }
          
          .status-en-cours {
            background: #cfe2ff;
            color: #084298;
          }
          
          .status-completee {
            background: #d1e7dd;
            color: #0f5132;
          }
          
          .description-section {
            margin-top: 30px;
          }
          
          .description-text {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #999;
            font-size: 12px;
          }
          
          .stamp {
            text-align: center;
            margin-top: 30px;
            color: #667eea;
          }
          
          .print-button {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            border-top: 1px solid #ddd;
          }
          
          .print-button button {
            padding: 10px 30px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
          }
          
          .print-button button:hover {
            background: #764ba2;
          }
          
          @media print {
            .print-button {
              display: none;
            }
            
            body {
              background: white;
            }
            
            .report-container {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <h1>🔧 Rapport d'Intervention</h1>
            <div class="header-info">
              <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
              <p><strong>ID:</strong> #${intervention.id || 'N/A'}</p>
            </div>
          </div>
          
          <div class="section">
            <h2>Informations Générales</h2>
            <div class="section-content">
              <div class="info-row">
                <span class="info-label">Type d'Intervention:</span>
                <span class="info-value"><strong>${intervention.typeIntervention || 'N/A'}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Date d'Intervention:</span>
                <span class="info-value"><strong>${dateIntervention}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Statut:</span>
                <span class="info-value">
                  <span class="status-badge status-${(intervention.statut || 'En attente').toLowerCase().replace(' ', '-')}">
                    ${intervention.statut || 'En attente'}
                  </span>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Coût:</span>
                <span class="info-value"><strong>${(intervention.cout || 0).toFixed(2)} DH</strong></span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Détails du Véhicule</h2>
            <div class="section-content">
              <div class="info-row">
                <span class="info-label">Marque & Modèle:</span>
                <span class="info-value"><strong>${intervention.vehicule?.marque || 'N/A'} ${intervention.vehicule?.modele || ''}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Immatriculation:</span>
                <span class="info-value"><strong>${intervention.vehicule?.immatriculation || 'N/A'}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Année:</span>
                <span class="info-value"><strong>${intervention.vehicule?.annee || 'N/A'}</strong></span>
              </div>
            </div>
          </div>
          
          <div class="description-section">
            <h2>Description de l'Intervention</h2>
            <div class="description-text">
${intervention.description || 'Aucune description fournie'}
            </div>
          </div>
          
          <div class="footer">
            <p>Ce rapport a été généré automatiquement le ${new Date().toLocaleString('fr-FR')}</p>
            <p>© 2026 Toyota Service Management System</p>
          </div>
          
          <div class="print-button">
            <button onclick="window.print()">🖨️ Imprimer ce rapport</button>
          </div>
        </div>
      </body>
      </html>
    `;

    // Write content to print window
    printWindow.document.write(reportHTML);
    printWindow.document.close();

    // Auto-open print dialog after content loads
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  generateBulkReport(interventions: Intervention[]): void {
    if (!interventions || interventions.length === 0) {
      alert('Aucune intervention à générer');
      return;
    }

    const printWindow = window.open('', '', 'height=600,width=1000');
    if (!printWindow) {
      alert('Impossible d\'ouvrir la fenêtre d\'impression');
      return;
    }

    let interventionRows = '';
    let totalCost = 0;

    interventions.forEach((intv, index) => {
      const dateIntervention = new Date(intv.dateIntervention).toLocaleDateString('fr-FR');
      const cost = intv.cout || 0;
      totalCost += cost;
      
      interventionRows += `
        <tr>
          <td>${index + 1}</td>
          <td>${intv.vehicule?.marque || 'N/A'} ${intv.vehicule?.modele || ''}</td>
          <td>${intv.typeIntervention || 'N/A'}</td>
          <td>${dateIntervention}</td>
          <td>${intv.statut || 'N/A'}</td>
          <td class="amount">${cost.toFixed(2)} DH</td>
        </tr>
      `;
    });

    const bulkReportHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Rapport des Interventions</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            background: white;
            color: #333;
            padding: 20px;
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
          }
          
          .report-header h1 {
            color: #667eea;
            font-size: 24px;
            margin-bottom: 10px;
          }
          
          .report-info {
            text-align: right;
            margin-bottom: 20px;
            color: #666;
            font-size: 12px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #667eea;
          }
          
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          
          tr:hover {
            background: #f8f9fa;
          }
          
          .amount {
            text-align: right;
            font-weight: 600;
          }
          
          .total-row {
            background: #f8f9fa;
            font-weight: 600;
            border-top: 2px solid #667eea;
          }
          
          .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          
          .print-button {
            text-align: center;
            margin-top: 20px;
          }
          
          .print-button button {
            padding: 10px 30px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
          }
          
          @media print {
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>📊 Rapport des Interventions</h1>
          <div class="report-info">
            <p>Généré le ${new Date().toLocaleString('fr-FR')}</p>
            <p>Total interventions: ${interventions.length}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Véhicule</th>
              <th>Type</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Coût</th>
            </tr>
          </thead>
          <tbody>
            ${interventionRows}
            <tr class="total-row">
              <td colspan="5">TOTAL</td>
              <td class="amount">${totalCost.toFixed(2)} DH</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>© 2026 Toyota Service Management System</p>
        </div>
        
        <div class="print-button">
          <button onclick="window.print()">🖨️ Imprimer ce rapport</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(bulkReportHTML);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
