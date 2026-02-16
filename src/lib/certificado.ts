import jsPDF from 'jspdf'

interface CertificadoData {
  nomeColaborador: string
  departamento?: string
  dataEmissao: string
  cargaHoraria: string
  notaMedia: number
  totalModulos: number
  totalLicoes: number
}

export function gerarCertificadoPDF(data: CertificadoData): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()

  // Background
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, width, height, 'F')

  // Border
  doc.setDrawColor(0, 168, 89) // unimed-green
  doc.setLineWidth(3)
  doc.rect(10, 10, width - 20, height - 20)

  // Inner border
  doc.setLineWidth(0.5)
  doc.setDrawColor(200, 200, 200)
  doc.rect(15, 15, width - 30, height - 30)

  // Header decoration
  doc.setFillColor(0, 168, 89)
  doc.rect(0, 0, width, 8, 'F')
  doc.rect(0, height - 8, width, 8, 'F')

  // Logo placeholder (círculo com U)
  doc.setFillColor(0, 168, 89)
  doc.circle(width / 2, 35, 15, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('U', width / 2, 40, { align: 'center' })

  // Company name
  doc.setTextColor(0, 168, 89)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('UNIMED CARIRI', width / 2, 58, { align: 'center' })

  // Title
  doc.setTextColor(51, 51, 51)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICADO DE CONCLUSÃO', width / 2, 75, { align: 'center' })

  // Decorative line
  doc.setDrawColor(0, 168, 89)
  doc.setLineWidth(1)
  doc.line(width / 2 - 60, 80, width / 2 + 60, 80)

  // Certificate text
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Certificamos que', width / 2, 95, { align: 'center' })

  // Name
  doc.setTextColor(51, 51, 51)
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.text(data.nomeColaborador.toUpperCase(), width / 2, 110, { align: 'center' })

  // Department
  if (data.departamento) {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Departamento: ${data.departamento}`, width / 2, 120, { align: 'center' })
  }

  // Decorative line under name
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.line(width / 2 - 80, 125, width / 2 + 80, 125)

  // Description
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  const description = [
    'concluiu com êxito o Treinamento de Capacitação',
    'Unimed Cariri - Formação de Colaboradores',
  ]
  
  doc.text(description[0], width / 2, 138, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.text(description[1], width / 2, 146, { align: 'center' })

  // Stats boxes
  const boxY = 158
  const boxWidth = 55
  const boxHeight = 22
  const startX = width / 2 - (boxWidth * 3 + 20) / 2

  // Box 1 - Carga Horária
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(startX, boxY, boxWidth, boxHeight, 3, 3, 'F')
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Carga Horária', startX + boxWidth / 2, boxY + 8, { align: 'center' })
  doc.setTextColor(51, 51, 51)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(data.cargaHoraria, startX + boxWidth / 2, boxY + 17, { align: 'center' })

  // Box 2 - Nota Média
  const box2X = startX + boxWidth + 10
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(box2X, boxY, boxWidth, boxHeight, 3, 3, 'F')
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Nota Média', box2X + boxWidth / 2, boxY + 8, { align: 'center' })
  doc.setTextColor(51, 51, 51)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`${data.notaMedia}%`, box2X + boxWidth / 2, boxY + 17, { align: 'center' })

  // Box 3 - Módulos/Lições
  const box3X = box2X + boxWidth + 10
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(box3X, boxY, boxWidth, boxHeight, 3, 3, 'F')
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Conteúdo', box3X + boxWidth / 2, boxY + 8, { align: 'center' })
  doc.setTextColor(51, 51, 51)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`${data.totalModulos} módulos, ${data.totalLicoes} lições`, box3X + boxWidth / 2, boxY + 17, { align: 'center' })

  // Date
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Emitido em ${data.dataEmissao}`, width / 2, 192, { align: 'center' })

  // Signature line
  doc.setDrawColor(150, 150, 150)
  doc.setLineWidth(0.3)
  doc.line(width / 2 - 40, 200, width / 2 + 40, 200)
  
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.text('Coordenação de Treinamento', width / 2, 206, { align: 'center' })

  // Save
  const fileName = `certificado-unimed-cariri-${data.nomeColaborador.toLowerCase().replace(/\s+/g, '-')}.pdf`
  doc.save(fileName)
}
