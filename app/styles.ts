import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FCB216',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    imageContainer: {
        marginBottom: 80,
    },
    fortuneImage: {
        height: 400,
        width: 300,
    },
    generateButton: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#7130DA',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 100,
    },
    buttonText: {
        fontFamily: 'RobotoSlab_400Regular',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.15,
        color: '#FFFFFF',
    },
    errorText: {
        color: '#ef4444',
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
    },
    loadingText: {
        fontSize: 20,
        color: '#6366f1',
        fontWeight: '500',
    },
    fortuneContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    fortuneText: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: '#1f2937',
        fontWeight: '500',
        fontFamily: 'Arial',
        marginBottom: 24,
    },
    fortuneSubtext: {
        fontSize: 16,
        color: '#6b7280',
        fontStyle: 'italic',
    },
}); 