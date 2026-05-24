import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  // Estados da Urna
  const [tela, setTela] = useState('menu'); // menu, cadastro, votacao, resultados
  const [candidatos, setCandidatos] = useState([]);
  
  // Estados do Cadastro
  const [nomeCad, setNomeCad] = useState('');
  const [numeroCad, setNumeroCad] = useState('');
  const [fotoCad, setFotoCad] = useState(null);

  // Estados da Votação
  const [digitos, setDigitos] = useState('');
  const [candidatoAtivo, setCandidatoAtivo] = useState(null);
  const [votosBrancos, setVotosBrancos] = useState(0);
  const [votosNulos, setVotosNulos] = useState(0);

  // Função para tocar o som do "Plim Plim" da Urna
  async function tocarSomConfirma() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/buttons/sounds/beep-07a.mp3' } // Som alternativo seguro online
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Erro ao tocar som:', error);
    }
  }

  // Função para selecionar foto da galeria do celular
  async function selecionarFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para o candidato!');
      return;
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFotoCad(resultado.assets[0].uri);
    }
  }

  // Salvar Candidato
  function salvarCandidato() {
    if (!nomeCad || !numeroCad || numeroCad.length !== 2) {
      Alert.alert('Erro', 'Insira o nome e um número de exatamente 2 dígitos.');
      return;
    }
    
    // Verificar se número já existe
    if (candidatos.some(c => c.numero === numeroCad)) {
      Alert.alert('Erro', 'Este número de candidato já foi registrado.');
      return;
    }

    const novoCandidato = {
      nome: nomeCad,
      numero: numeroCad,
      foto: fotoCad,
      votos: 0
    };

    setCandidatos([...candidatos, novoCandidato]);
    setNomeCad('');
    setNumeroCad('');
    setFotoCad(null);
    Alert.alert('Sucesso', 'Candidato cadastrado com sucesso!');
    setTela('menu');
  }

  // Monitorar digitação na Urna
  useEffect(() => {
    if (digitos.length === 2) {
      const cadastrado = candidatos.find(c => c.numero === digitos);
      if (cadastrado) {
        setCandidatoAtivo(cadastrado);
      } else {
        setCandidatoAtivo({ nome: 'VOTO NULO', numero: digitos, nulo: true });
      }
    } else {
      setCandidatoAtivo(null);
    }
  }, [digitos]);

  // Teclado da Urna
  function pressionarBotao(num) {
    if (digitos.length < 2) {
      setDigitos(digitos + num);
    }
  }

  function corrigir() {
    setDigitos('');
    setCandidatoAtivo(null);
  }

  function votarBranco() {
    if (digitos.length > 0) return; // Branco só se não digitou nada
    setVotosBrancos(votosBrancos + 1);
    tocarSomConfirma();
    Alert.alert('Urna Eletrônica', 'VOTO COMPUTADO COM SUCESSO!');
    corrigir();
    setTela('menu');
  }

  function confirmarVoto() {
    if (digitos.length < 2) return;

    if (candidatoAtivo.nulo) {
      setVotosNulos(votosNulos + 1);
    } else {
      candidatoAtivo.votos += 1;
    }

    tocarSomConfirma();
    Alert.alert('Urna Eletrônica', 'VOTO COMPUTADO COM SUCESSO!');
    corrigir();
    setTela('menu');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloPrincipal}>🗳️ URNA ELEITORAL CRIADO {''} POR LUIZ HENRIQUE DE FARIAS</Text> 

      {/* TELA: MENU PRINCIPAL */}
      {tela === 'menu' && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.botaoMenu} onPress={() => setTela('cadastro')}>
            <Text style={styles.textoBotaoMenu}>📝 Cadastrar Candidatos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botaoMenu, { backgroundColor: '#1B5E20' }]} onPress={() => setTela('votacao')}>
            <Text style={styles.textoBotaoMenu}>⚡ Iniciar Votação</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botaoMenu, { backgroundColor: '#E65100' }]} onPress={() => setTela('resultados')}>
            <Text style={styles.textoBotaoMenu}>📊 Ver Resultados</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TELA: CADASTRO */}
      {tela === 'cadastro' && (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.subtitulo}>Cadastro de Candidato</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Nome do Candidato" 
            placeholderTextColor="#78909C" // <-- Corrigido para aparecer o texto de ajuda cinza
            value={nomeCad} 
            onChangeText={setNomeCad} 
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Número (2 dígitos)" 
            placeholderTextColor="#78909C" // <-- Corrigido para aparecer o texto de ajuda cinza
            keyboardType="numeric" 
            maxLength={2} 
            value={numeroCad} 
            onChangeText={setNumeroCad} 
          />
          
          <TouchableOpacity style={styles.botaoFoto} onPress={selecionarFoto}>
            <Text style={styles.textoBotao}>📸 {fotoCad ? 'Foto Selecionada ✓' : 'Selecionar Foto'}</Text>
          </TouchableOpacity>

          {fotoCad && <Image source={{ uri: fotoCad }} style={styles.previewFoto} />}

          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarCandidato}>
            <Text style={styles.textoBotaoMenu}>Salvar Candidato</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setTela('menu')}>
            <Text style={styles.linkVoltar}>Voltar ao Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* TELA: URNA (VOTAÇÃO) */}
      {tela === 'votacao' && (
        <View style={styles.urnaContainer}>
          {/* Visor da Urna */}
          <View style={styles.visor}>
            <Text style={styles.visorHeader}>SEU VOTO VAI PARA:</Text>
            <Text style={styles.cargoVisor}>PRESIDENTE</Text>
            
            <View style={styles.visorLinhaDigitos}>
              <Text style={styles.labelNumero}>Número:</Text>
              <View style={styles.quadradoNumero}><Text style={styles.txtDigito}>{digitos[0] || ''}</Text></View>
              <View style={styles.quadradoNumero}><Text style={styles.txtDigito}>{digitos[1] || ''}</Text></View>
            </View>

            {candidatoAtivo && (
              <View style={styles.dadosCandidato}>
                <Text style={styles.nomeVisor}>Nome: {candidatoAtivo.nome}</Text>
                {candidatoAtivo.foto && <Image source={{ uri: candidatoAtivo.foto }} style={styles.fotoVisor} />}
              </View>
            )}
          </View>

          {/* Teclado Físico da Urna */}
          <View style={styles.teclado}>
            <View style={styles.linhaTeclado}>
              {['1', '2', '3'].map(n => <TouchableOpacity key={n} style={styles.btnTeclado} onPress={() => pressionarBotao(n)}><Text style={styles.txtBtn}>{n}</Text></TouchableOpacity>)}
            </View>
            <View style={styles.linhaTeclado}>
              {['4', '5', '6'].map(n => <TouchableOpacity key={n} style={styles.btnTeclado} onPress={() => pressionarBotao(n)}><Text style={styles.txtBtn}>{n}</Text></TouchableOpacity>)}
            </View>
            <View style={styles.linhaTeclado}>
              {['7', '8', '9'].map(n => <TouchableOpacity key={n} style={styles.btnTeclado} onPress={() => pressionarBotao(n)}><Text style={styles.txtBtn}>{n}</Text></TouchableOpacity>)}
            </View>
            <View style={styles.linhaTeclado}>
              <TouchableOpacity style={styles.btnTeclado} onPress={() => pressionarBotao('0')}><Text style={styles.txtBtn}>0</Text></TouchableOpacity>
            </View>

            {/* Botões de Ação Inferiores */}
            <View style={styles.botoesAcao}>
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#FFF' }]} onPress={votarBranco}>
                <Text style={[styles.txtBtnAcao, { color: '#000' }]}>BRANCO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#E53935' }]} onPress={corrigir}>
                <Text style={styles.txtBtnAcao}>CORRIGE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#43A047', height: 60 }]} onPress={confirmarVoto}>
                <Text style={styles.txtBtnAcao}>CONFIRMA</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => { corrigir(); setTela('menu'); }}>
            <Text style={styles.linkVoltar}>Fechar Urna</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TELA: RESULTADOS */}
      {tela === 'resultados' && (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.subtitulo}>📊 Resultado da Apuração</Text>
          
          {candidatos.map((c, i) => (
            <View key={i} style={styles.cardResultado}>
              <Text style={styles.txtResultado}>{c.nome} ({c.numero}): {c.votos} votos</Text>
            </View>
          ))}
          
          <View style={styles.cardResultado}>
            <Text style={styles.txtResultado}>Votos em Branco: {votosBrancos}</Text>
          </View>
          <View style={styles.cardResultado}>
            <Text style={styles.txtResultado}>Votos Nulos: {votosNulos}</Text>
          </View>

          <TouchableOpacity style={[styles.botaoMenu, { backgroundColor: '#D32F2F', marginTop: 20 }]} onPress={() => { setCandidatos([]); setVotosBrancos(0); setVotosNulos(0); Alert.alert('Zerada', 'Urna zerada para novas votações!'); }}>
            <Text style={styles.textoBotaoMenu}>🔄 Zerar Urna </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTela('menu')}>
            <Text style={styles.linkVoltar}>Voltar ao Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECEFF1', paddingTop: 50, alignItems: 'center' },
  tituloPrincipal: { fontSize: 22, fontWeight: 'bold', color: '#37474F', marginBottom: 20, textAlign: 'center', paddingHorizontal: 10 },
  menuContainer: { width: '90%', justifyContent: 'center', marginTop: 50 },
  botaoMenu: { backgroundColor: '#263238', padding: 18, borderRadius: 8, marginBottom: 15, alignItems: 'center' },
  textoBotaoMenu: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  formContainer: { width: 340, alignItems: 'center', paddingBottom: 30 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#263238' },
  input: { width: '100%', backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginBottom: 12, borderWidth: 1, borderColor: '#CFD8DC', color: '#000' },
  botaoFoto: { backgroundColor: '#78909C', padding: 12, borderRadius: 6, width: '100%', alignItems: 'center', marginBottom: 12 },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  previewFoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  botaoSalvar: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 6, width: '100%', alignItems: 'center' },
  linkVoltar: { marginTop: 20, color: '#1565C0', fontWeight: 'bold', fontSize: 16 },
  urnaContainer: { width: '95%', alignItems: 'center' },
  visor: { width: '100%', height: 180, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#78909C', padding: 10, position: 'relative' },
  visorHeader: { fontSize: 12, fontWeight: 'bold' },
  cargoVisor: { fontSize: 18, fontWeight: 'bold', marginVertical: 5, textAlign: 'center' },
  visorLinhaDigitos: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  labelNumero: { fontSize: 14, marginRight: 10 },
  quadradoNumero: { width: 30, height: 40, borderWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  txtDigito: { fontSize: 20, fontWeight: 'bold' },
  dadosCandidato: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  nomeVisor: { fontSize: 16, fontWeight: 'bold', width: '60%' },
  fotoVisor: { width: 60, height: 60, position: 'absolute', right: 5, bottom: -10, borderWidth: 1 },
  teclado: { backgroundColor: '#212121', width: '100%', padding: 15, marginTop: 15, borderRadius: 8 },
  linhaTeclado: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  btnTeclado: { backgroundColor: '#37474F', width: 60, height: 45, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, borderRadius: 4 },
  txtBtn: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  botoesAcao: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'flex-end' },
  btnAcao: { width: '30%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  txtBtnAcao: { fontSize: 11, fontWeight: 'bold', color: '#000' },
  cardResultado: { width: '100%', backgroundColor: '#FFF', padding: 15, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#CFD8DC' },
  txtResultado: { fontSize: 16, fontWeight: 'bold', color: '#37474F' }
});