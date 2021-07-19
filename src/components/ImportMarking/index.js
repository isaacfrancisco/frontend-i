import React, { useState, useCallback, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../services/api';
import { useDropzone } from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
import { error, baseStyle, acceptStyle, activeStyle, rejectStyle } from '../../styles';

export default function ImportMarking(props) {
    var colaboradores = localStorage.getItem('colaboradores');

    const { open, onClose, handleRefresh } = props;

    const [selectedFile, setSelectedFile] = useState([]);

    const [textErrorImport, setTextErrorImport] = useState('');

    const [disabledButton, setDisabledButton] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        debugger
        setDisabledButton(false);
        setTextErrorImport('');
        colaboradores = JSON.parse(colaboradores);
        if (colaboradores.length === 0) {
            setTextErrorImport('É necessário adicionar colaboradores antes de importar!');
            setDisabledButton(true);
        } else {
            console.log(colaboradores);
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = function () {
                var markings = [];
                const lines = reader.result.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    var sequential_record = lines[i].slice(0, 9);
                    var hora = lines[i].slice(18, 22);
                    var hora2 = parseInt(hora);
                    var marking_hour = hora.substr(0, 2) + ":" + hora.substr(2, 4);
                    var marking_type;
                    marking_type = "";
                    if ((hora2 >= 801 && hora2 <= 1201) || (hora2 >= 1301 && hora2 <= 1801)) {
                        marking_type = "Saída";
                    } else {
                        marking_type = "Entrada";
                    }
                    var pis = lines[i].slice(22, 34);
                    var colaborador = colaboradores.find(x => x.pis === pis);
                    var collaborator = colaborador.nome;
                    var date = lines[i].slice(10, 18);
                    var marking_date = date.substr(0, 2) + '-' + date.substr(2, 2) + '-' + date.substr(4, 4);
                    var completed_marking = lines[i];
                    var marking = {
                        sequential_record: sequential_record,
                        marking_type: marking_type,
                        collaborator: collaborator,
                        marking_date: marking_date,
                        marking_hour: marking_hour,
                        completed_marking: completed_marking
                    }
                    markings.push(marking);
                }
                setSelectedFile(markings);
            }
            reader.readAsText(file);
            console.log(selectedFile);
        }
    }, []);

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: 'text/plain'
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    async function handleImport(e) {
        e.preventDefault();
        debugger
        try {
            await api.post("/markings", {
                selectedFile
            });
            handleRefresh();
            onClose();
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Importar Pontos</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Selecione um arquivo .txt para importar os pontos.
                    </DialogContentText>
                    <div className="container">
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <p>Arraste e solte, ou clique para selecionar um arquivo</p>
                            <em>(Apenas arquivos *.txt são aceitos!)</em>
                        </div>
                        <aside>
                            <h4>Arquivo selecionado:</h4>
                            <ul>{acceptedFileItems}</ul>
                            <p style={error}>{textErrorImport && <Typography style={error}>{textErrorImport}</Typography>}</p>
                        </aside>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button disabled={disabledButton} color="primary" onClick={handleImport}>
                        Importar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}