import { supabase } from '../lib/supabase';

/**
 * Serviço responsável por buscar eventos ativos no banco de dados.
 */
export const getActiveEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar eventos:', err);
    if (import.meta.env.DEV) {
      // Retorna dados falsos (Mock) em caso de erro local (como falta de setup do Supabase)
      return getMockEvents();
    }
    return [];
  }
};

/**
 * Mock de eventos para desenvolvimento
 */
function getMockEvents() {
  return [
    {
      id: '1',
      title: 'Encontro de Casais',
      date_description: '13 de Junho',
      speaker: 'Pr. Júnior',
      price: 80.00,
      cover_url: null,
    },
    {
      id: '2',
      title: 'Mães e Filhas',
      date_description: '16 de Maio',
      speaker: 'Ir. Leda',
      price: 60.00,
      cover_url: null,
    },
    {
      id: '3',
      title: 'Retiro de Carnaval 2026',
      date_description: '14 a 18 de Fev',
      speaker: 'Pr. Maesley',
      price: 390.00,
      cover_url: null,
    }
  ];
}

/**
 * Busca um evento específico pelo ID
 */
export const getEventById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(err);
    if (import.meta.env.DEV) {
      return {
        id,
        title: 'Evento de Teste (Modo Dev)',
        date_description: 'Data Fictícia',
        price: 150.00
      };
    }
    throw err;
  }
};

/**
 * Envia uma nova inscrição
 */
export const submitRegistration = async (formData, eventId) => {
  const { error } = await supabase
    .from('registrations')
    .insert([{ ...formData, event_id: eventId }]);
    
  if (error) throw error;
  return true;
};
