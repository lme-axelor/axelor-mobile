import React, {useEffect, useState, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Button,
  FormHtmlInput,
  FormInput,
  Screen,
  StarScore,
} from '@axelor/aos-mobile-ui';
import {useSelector, useDispatch, useTranslator} from '@axelor/aos-mobile-core';
import {fetchProspectById, updateProspect} from '../../features/prospectSlice';

const ProspectFormScreen = ({navigation, route}) => {
  const idProspect = route.params.idProspect;
  const {prospect} = useSelector(state => state.prospect);
  const dispatch = useDispatch();
  const I18n = useTranslator();

  const [score, setScore] = useState(prospect.leadScoringSelect);
  const [name, setName] = useState(prospect.name);
  const [fixedPhone, setFixedPhone] = useState(prospect.fixedPhone);
  const [email, setEmail] = useState(prospect.emailAddress?.address);
  const [webSite, setWebSite] = useState(prospect.webSite);
  const [description, setDescription] = useState(prospect.description);

  useEffect(() => {
    dispatch(fetchProspectById({partnerId: idProspect}));
  }, [dispatch, idProspect]);

  const updateProspectAPI = useCallback(() => {
    dispatch(
      updateProspect({
        prospectId: idProspect,
        prospectVersion: prospect.version,
        prospectScore: score,
        prospectName: name,
        prospectFixedPhone: fixedPhone,
        prospectWebsite: webSite,
        prospectDescription: description,
        emailId: prospect.emailAddress.id,
        emailVersion: prospect.emailAddress.$version,
        prospectEmail: email,
      }),
    );

    navigation.navigate('ProspectDetailsScreen', {
      idProspect: idProspect,
    });
  }, [
    dispatch,
    idProspect,
    prospect.version,
    prospect.emailAddress?.id,
    prospect.emailAddress?.$version,
    score,
    name,
    fixedPhone,
    webSite,
    description,
    email,
    navigation,
  ]);

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.containerKeyboard}
        keyboardVerticalOffset={180}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <StarScore
              style={styles.score}
              score={score}
              showMissingStar={true}
              onPress={setScore}
              editMode={true}
            />
          </View>
          <View style={styles.container}>
            <FormInput
              style={styles.input}
              title={I18n.t('Crm_Name')}
              onChange={setName}
              defaultValue={name}
            />
            <FormInput
              style={styles.input}
              title={I18n.t('Crm_Phone')}
              onChange={setFixedPhone}
              defaultValue={fixedPhone}
            />
            <FormInput
              style={styles.input}
              title={I18n.t('Crm_Email')}
              onChange={setEmail}
              defaultValue={email}
            />
            <FormInput
              style={styles.input}
              title={I18n.t('Crm_WebSite')}
              onChange={setWebSite}
              defaultValue={webSite}
            />
            <FormHtmlInput
              title={I18n.t('Crm_Notes')}
              onChange={setDescription}
              defaultValue={description}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.button_container}>
        <Button title={I18n.t('Base_Save')} onPress={updateProspectAPI} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  containerKeyboard: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  score: {
    marginRight: '10%',
  },
  headerContainer: {
    flexDirection: 'row-reverse',
  },
  button_container: {
    marginVertical: '1%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  input: {
    width: '90%',
  },
});

export default ProspectFormScreen;