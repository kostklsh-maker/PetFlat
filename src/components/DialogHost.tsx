import { useEffect, useState } from 'react';
import { Alert, Modal, Platform, Pressable, Text, View, type AlertButton } from 'react-native';
import { colors, radius, spacing } from './theme';

interface Dialog {
  title: string;
  message?: string;
  buttons: AlertButton[];
}

let show: ((d: Dialog) => void) | null = null;

// react-native-web's Alert.alert does nothing, so on web every Alert.alert call in the app is routed to DialogHost.
if (Platform.OS === 'web') {
  Alert.alert = (title, message, buttons) => {
    show?.({ title, message, buttons: buttons?.length ? buttons : [{ text: 'OK' }] });
  };
}

/** Renders Alert.alert dialogs on web; renders nothing on iOS/Android, where native alerts are used. */
export function DialogHost() {
  const [queue, setQueue] = useState<Dialog[]>([]);

  useEffect(() => {
    show = (d) => setQueue((q) => [...q, d]);
    return () => {
      show = null;
    };
  }, []);

  const dialog = queue[0];
  if (Platform.OS !== 'web' || !dialog) return null;

  const close = (button?: AlertButton) => {
    setQueue((q) => q.slice(1));
    button?.onPress?.();
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => close(dialog.buttons.find((b) => b.style === 'cancel'))}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing(6),
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: spacing(5),
            gap: spacing(3),
            width: '100%',
            maxWidth: 360,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{dialog.title}</Text>
          {dialog.message ? <Text style={{ fontSize: 15, color: colors.muted }}>{dialog.message}</Text> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: spacing(2) }}>
            {dialog.buttons.map((b, i) => (
              <Pressable
                key={`${b.text}-${i}`}
                onPress={() => close(b)}
                style={({ pressed }) => ({
                  paddingHorizontal: spacing(4),
                  paddingVertical: spacing(2),
                  borderRadius: radius.sm,
                  backgroundColor: pressed ? colors.bg : 'transparent',
                })}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: b.style === 'cancel' ? '400' : '600',
                    color: b.style === 'destructive' ? colors.danger : colors.primary,
                  }}
                >
                  {b.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
