import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Container } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getVideoUsers } from 'app/entities/video-user/video-user.reducer';
import { getEntity, updateEntity, createEntity } from './video.reducer';

import './video-update.scss'
import axios from 'axios';

export const VideoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const videoUsers = useAppSelector(state => state.videoUser.entities);
  const videoEntity = useAppSelector(state => state.video.entity);
  const loading = useAppSelector(state => state.video.loading);
  const updating = useAppSelector(state => state.video.updating);
  const updateSuccess = useAppSelector(state => state.video.updateSuccess);

  const handleClose = () => {
    navigate('/video');
  };

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(id));
    }

    dispatch(getVideoUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...videoEntity,
      ...values,
      uploader: videoUsers.find(it => it.id.toString() === values.uploader.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...videoEntity,
          uploader: videoEntity?.uploader?.id,
        };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [file, setFile] = React.useState(null);

  const handleSubmit = async(event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios({
        method: "post",
        url: "/api/fileupload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Uploaded Success!")
    } catch(error) {
      console.log(error)
    }
  }

  const handleFileSelect = (event) => {
    setFile(event.target.files[0])

  }

  return (
    <div>
      <Container>
      <Row className="justify-content-center">
        <Col md="6">
          <h2 id="groupProjectApp.video.home.createOrEditLabel" data-cy="VideoCreateUpdateHeading">
            <div>Upload YouTube Video</div>
          </h2>
        </Col>
        <Col><h2>Upload mp4 Video File</h2></Col>
      </Row>
      <Row>
        <Col md="6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="video-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('groupProjectApp.video.videoLink')}
                id="video-videoLink"
                name="videoLink"
                data-cy="videoLink"
                type="textarea"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('groupProjectApp.video.title')}
                id="video-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('groupProjectApp.video.description')}
                id="video-description"
                name="description"
                data-cy="description"
                type="text"
              />
              <ValidatedField
                label={translate('groupProjectApp.video.uploadDate')}
                id="video-uploadDate"
                name="uploadDate"
                data-cy="uploadDate"
                type="date"
              />
              <ValidatedField
                id="video-uploader"
                name="uploader"
                data-cy="uploader"
                label={translate('groupProjectApp.video.uploader')}
                type="select"
              >
                <option value="" key="0" />
                {videoUsers
                  ? videoUsers.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/video" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
        <Col md="6">
          <body className='notbackground'>
          
          <form onSubmit={handleSubmit}>
              <div>&nbsp;</div>
            <div>
              <input type="file" onChange={handleFileSelect} className="btn btn-primary jh-create-entity"/>
            </div>
            &nbsp;
            <div>
            <input type="submit" value="Upload File" name="file" id="file" className="btn btn-primary jh-create-entity"/>
            </div>
          </form>
          </body>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default VideoUpdate;
