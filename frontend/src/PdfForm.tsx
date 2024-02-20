import { useState } from 'react';


interface Pdf {
    id: number;
    type: string;
    name: string;
    surname: string;
    createdAt: string;
}


function PDFForm() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [PdfHistory, setPdfHistory] = useState<Pdf[]>([]);

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const CreatePdf = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const documentTypeCapitalized = capitalizeFirstLetter(documentType);

        try {
            console.log('Type de document sélectionné :', documentType);

            const response = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: documentTypeCapitalized, name, surname }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const pdfUrl = window.URL.createObjectURL(blob);
                window.open(pdfUrl, '_blank');
            } else {
                const errorData = await response.json()
                console.log('Erreur lors de la génération du PDF', errorData.message);
            }
        } catch (error) {
            console.log(`Erreur lors de la requête à l'API:`, error);
            console.log(`Erreur lors de la communication avec l'API`);
        }
    };
    const ShowHistory = async () => {

        try {
            console.log('Type de document sélectionné :', documentType);

            const response = await fetch('http://localhost:3000/api/history', {
                method: 'GET',
            });

            if (response.ok) {
                const history = await response.json()
                setPdfHistory(history)
            } else {
                const errorData = await response.json()
                console.log('Erreur lors de la génération du PDF', errorData.message);
            }
        } catch (error) {
            console.log(`Erreur lors de la requête à l'API:`, error);
            console.log(`Erreur lors de la communication avec l'API`);
        }
    };


    const DeletePdf = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPdfHistory(currentHistory => {
                    const updatedHistory = currentHistory.filter(pdf => pdf.id !== id);
                    return updatedHistory;
                });
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de la suppression du PDF', errorData.message);
            }
        } catch (error) {
            console.error(`Erreur lors de la requête à l'API:`, error);
        }
    };

    const renderPdfHistory = () => (
        <ul>
            {PdfHistory.map((pdf) => (
                <li key={pdf.id}>
                    {pdf.type} - {new Date(pdf.createdAt).toLocaleDateString()}
                    <button onClick={() => DeletePdf(pdf.id)}>Supprimer</button>
                </li>
            ))}
        </ul>
    );


    return (
        <div className='main'>
            <h1>Générateur de pdf</h1>
            <form onSubmit={CreatePdf}>
                <label>
                    Choisissez votre profession:
                    <select value={documentType} onChange={e => setDocumentType(e.target.value)}>
                        <option value="">Sélectionner</option>
                        <option value="commerce">commerce</option>
                        <option value="droit">droit</option>
                        <option value="social">social</option>
                    </select>
                </label>
                <input className='input' type="text" placeholder="nom" value={name} onChange={e => setName(e.target.value)} />
                <input className='input' type="text" placeholder="metier" value={surname} onChange={e => setSurname(e.target.value)} />
                <div className="button-group">
                    
                <button type="submit">Création du  PDF</button>
                <button type="button" onClick={ShowHistory}> Historique </button>
                </div>
            </form>
            {renderPdfHistory()}
        </div>


    );
}

export default PDFForm
