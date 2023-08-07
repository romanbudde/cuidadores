import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
	page: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		backgroundColor: '#E4E4E4',
	},
	container: {
		flex: 1,
		padding: '35',
		gap: 15,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 40,
		marginBottom: 20,
		textAlign: 'center',
	},
	successMessage: {
		fontSize: 18,
		fontWeight: 'bold',
	},
});

const ComprobanteContrato = ({ contract, cuidador, cliente, renderTimeRanges }) => {

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.container}>
					<View style={styles.title}>
						<Text>Comprobante de pago</Text>
					</View>
					<Text>
						<Text style={{ fontStyle: 'bold' }}>Número de contrato: </Text> {contract.id}
					</Text>
					<Text>Nombre del cuidador: {cuidador.name}</Text>
					<Text>Email del cuidador: {cuidador.mail}</Text>
					<Text>Nombre del cliente: {cliente.name}</Text>
					<Text>Email del cliente: {cliente.mail}</Text>
					<Text>Fecha del contrato: {contract.date}</Text>
					<Text>Horarios: {renderTimeRanges(contract.horarios)}.</Text>
					<Text>Monto total: ${contract.amount}</Text>
					<Text>
						Estado del pago: {contract.payment_status === 'approved' ? 'Pagado' 
						: contract.payment_status === 'pending' ? 'Pendiente'
						: contract.payment_status === 'cancelled' ? 'Cancelado'
						: ''}
					</Text>
					<Text>
						{ contract.payment_method_id === 1 && (
							'Método de pago: Mercado Pago.'
						)}	
						{ contract.payment_method_id === 2 && (
							'Método de pago: Efectivo.'
						)}	
					</Text>
				</View>
			</Page>
		</Document>
	);
};

export default ComprobanteContrato;
