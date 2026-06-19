import { supabase } from '../lib/supabase';

export const fetchAllRegistrations = async () => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select(`*, events(title)`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    if (import.meta.env.DEV) {
      return getMockRegistrations();
    }
    return [];
  }
};

export const fetchAllEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    if (import.meta.env.DEV) {
      return [
        { id: '1', title: 'Retiro de Carnaval', date_description: '14 a 18 Fev', price: 390, active: true },
        { id: '2', title: 'Encontro de Casais', date_description: '13 Junho', price: 80, active: true }
      ];
    }
    return [];
  }
};

export const createEvent = async (newEvent, coverFile) => {
  let cover_url = null;
  if (coverFile) {
    const fileExt = coverFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('event-covers')
      .upload(filePath, coverFile);
      
    if (uploadError) throw uploadError;
    
    const { data: publicUrlData } = supabase.storage
      .from('event-covers')
      .getPublicUrl(filePath);
      
    cover_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from('events')
    .insert([{ ...newEvent, cover_url }]);

  if (error) throw error;
  return true;
};

export const toggleEventStatus = async (id, currentStatus) => {
  const { error } = await supabase
    .from('events')
    .update({ active: !currentStatus })
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteEvent = async (id) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const updateEvent = async (id, eventData, coverFile) => {
  let cover_url = eventData.cover_url;
  
  if (coverFile) {
    const fileExt = coverFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('event-covers')
      .upload(filePath, coverFile);
      
    if (uploadError) throw uploadError;
    
    const { data: publicUrlData } = supabase.storage
      .from('event-covers')
      .getPublicUrl(filePath);
      
    cover_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from('events')
    .update({ 
      title: eventData.title,
      date_description: eventData.date_description,
      speaker: eventData.speaker,
      price: eventData.price,
      cover_url 
    })
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const updatePaymentStatus = async (id, status) => {
  const { error } = await supabase
    .from('registrations')
    .update({ status_pagamento: status })
    .eq('id', id);
  if (error) throw error;
  return true;
};

function getMockRegistrations() {
  return [{
    id: '1',
    created_at: new Date().toISOString(),
    nome_completo: 'Visitante de Teste (Mock Data)',
    telefone: '(85) 99999-9999',
    igreja: 'Igreja Modelo',
    idade: 22,
    sexo: 'Feminino',
    rua: 'Rua Principal, 123', bairro: 'Centro', cidade: 'Fortaleza', estado: 'CE',
    email: 'teste@email.com',
    tipo_sanguineo: 'A+',
    problema_saude: 'Não', proibicao_medica: 'Não', alergia_medicamento: 'Não', tomando_remedio: 'Não',
    emergencia_nome: 'Contato', emergencia_telefone: '(85) 88888-8888',
    membro: 'Sim', crente: 'Sim', crente_anos: '2',
    outros: 'Mock data',
    events: { title: 'Evento Fictício' }
  }];
}
